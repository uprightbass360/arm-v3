"""Pure validation of a preset's HandBrake settings against the loaded schema. Does no I/O.

Each rule is one function returning an issue or None; ``_VALUE_RULES`` runs them in order and the first
issue wins, so a key is reported once.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from arm_common.handbrake_schema.effective import base_preset, effective_value
from arm_common.handbrake_schema.overlay import (
    ARM_OWNED_KEYS,
    ENCODER_SPECIFIC_KEYS,
    SELECTOR_FILTER_ALIASES,
    SOURCE_EXTRAS,
    STATIC_ENUMS,
)
from arm_common.handbrake_schema.types import HandbrakeSchema, KeySpec
from arm_common.schemas.handbrake import HandbrakeSettings, IssueCode, SettingIssue

_LIST_ITEM = "{list}[{index}].{key}"


@dataclass(frozen=True)
class _Target:
    """One value to check: its spec, the name to report it under, and a lookup for sibling keys."""

    schema: HandbrakeSchema
    spec: KeySpec
    name: str
    value: Any
    sibling: Callable[[str], Any]


def _issue(name: str, code: IssueCode, message: str) -> SettingIssue:
    return SettingIssue(key=name, code=code, message=message)


def _is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


_TYPE_CHECKS: dict[str, Callable[[Any], bool]] = {
    "bool": lambda v: isinstance(v, bool),
    "int": lambda v: isinstance(v, int) and not isinstance(v, bool),
    "float": _is_number,
    "str": lambda v: isinstance(v, str),
    "list_str": lambda v: isinstance(v, list) and all(isinstance(i, str) for i in v),
    "list_obj": lambda v: isinstance(v, list) and all(isinstance(i, dict) for i in v),
}


def _check_known(keys: dict[str, KeySpec], name: str) -> SettingIssue | None:
    if name in keys:
        return None
    return _issue(name, "unknown_key", f"{name} is not a HandBrake setting")


def _check_placement(name: str) -> SettingIssue | None:
    if name in ARM_OWNED_KEYS:
        return _issue(name, "not_allowed_here", f"{name} is set by ARM and cannot be stored")
    if name in ENCODER_SPECIFIC_KEYS:
        return _issue(name, "not_allowed_here", f"{name} depends on the encoder, so it belongs in an encoder block")
    return None


def _check_type(target: _Target) -> SettingIssue | None:
    if _TYPE_CHECKS[target.spec.type](target.value):
        return None
    return _issue(target.name, "wrong_type", f"{target.value!r} is not a valid {target.spec.type} value")


def _selected_filter(target: _Target, selector: str) -> str | None:
    """The libhb filter a selector key currently names, or None when it names none (for example off)."""
    selected = target.sibling(selector)
    if not isinstance(selected, str):
        return None  # the selector itself is reported wrong_type
    name = SELECTOR_FILTER_ALIASES.get(selected, selected)
    return name if name in target.schema.filters else None


def _filter_values(target: _Target, attr: str) -> tuple[str, ...] | None:
    ref = target.spec.source.ref  # type: ignore[union-attr]
    name = ref if ref in target.schema.filters else _selected_filter(target, ref)
    if name is None:
        return None
    # A filter with no such list (hqdn3d has no tunes) accepts the template's "none" and leaves the rest alone.
    return getattr(target.schema.filters[name], attr) or None


def _mixdown_values(target: _Target) -> tuple[str, ...] | None:
    encoder = target.sibling(target.spec.source.ref)  # type: ignore[union-attr]
    if not isinstance(encoder, str):
        return None  # the encoder itself is reported wrong_type
    mixdowns: dict[str, tuple[str, ...]] = target.schema.lists["audio_mixdowns_by_encoder"]
    return mixdowns.get(encoder)


def _allowed_values(target: _Target) -> tuple[Any, ...] | None:
    """The values the key's source allows, or None when the source does not constrain it right now."""
    source = target.spec.source
    if source is None:
        return None
    resolvers: dict[str, Callable[[], tuple[Any, ...] | None]] = {
        "static": lambda: STATIC_ENUMS[source.ref],
        "schema_list": lambda: tuple(target.schema.lists[source.ref]),
        "filter_presets": lambda: _filter_values(target, "presets"),
        "filter_tunes": lambda: _filter_values(target, "tunes"),
        "audio_mixdowns": lambda: _mixdown_values(target),
    }
    allowed = resolvers[source.kind]()
    if allowed is None:
        return None
    return (*allowed, *SOURCE_EXTRAS.get(target.spec.name, ()))


def _check_source(target: _Target) -> SettingIssue | None:
    allowed = _allowed_values(target)
    if allowed is None:
        return None
    values = target.value if isinstance(target.value, list) else [target.value]
    for value in values:
        if value not in allowed:
            listed = ", ".join(str(a) for a in allowed)
            return _issue(target.name, "not_in_list", f"{value!r} is not one of {listed}")
    return None


def _check_limits(target: _Target) -> SettingIssue | None:
    limits = target.spec.limits
    if limits is None or not _is_number(target.value) or limits[0] <= target.value <= limits[1]:
        return None
    return _issue(target.name, "out_of_range", f"{target.value} is outside {limits[0]} to {limits[1]}")


_VALUE_RULES: tuple[Callable[[_Target], SettingIssue | None], ...] = (_check_type, _check_source, _check_limits)


def _first_issue(target: _Target) -> list[SettingIssue]:
    for rule in _VALUE_RULES:
        found = rule(target)
        if found is not None:
            return [found]
    return []


def _check_item(schema: HandbrakeSchema, list_name: str, index: int, item: dict[str, Any]) -> list[SettingIssue]:
    issues: list[SettingIssue] = []

    def sibling(key: str) -> Any:
        return item[key] if key in item else schema.audio_item_keys[key].default

    for key, value in item.items():
        name = _LIST_ITEM.format(list=list_name, index=index, key=key)
        unknown = _check_known(schema.audio_item_keys, key)
        if unknown is not None:
            issues.append(unknown.model_copy(update={"key": name}))
            continue
        issues += _first_issue(_Target(schema, schema.audio_item_keys[key], name, value, sibling))
    return issues


def _check_value(target: _Target) -> list[SettingIssue]:
    issues = _first_issue(target)
    if issues or target.spec.type != "list_obj":
        return issues
    return [i for n, item in enumerate(target.value) for i in _check_item(target.schema, target.name, n, item)]


def validate_common(schema: HandbrakeSchema, preset_ref: str | None, common: dict[str, Any]) -> list[SettingIssue]:
    """Rules 1 to 5 for the ``common`` settings, layered onto the built-in ``preset_ref``."""
    base_preset(schema, preset_ref)  # raises UnknownBasePreset early
    settings = HandbrakeSettings(common=common)

    def sibling(key: str) -> Any:
        return effective_value(schema, preset_ref, settings, key)

    issues: list[SettingIssue] = []
    for key, value in common.items():
        early = _check_known(schema.keys, key) or _check_placement(key)
        if early is not None:
            issues.append(early)
            continue
        issues += _check_value(_Target(schema, schema.keys[key], key, value, sibling))
    return issues

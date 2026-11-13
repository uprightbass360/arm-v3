"""Turns a preset's base, HandBrake settings and resolved encoder family into a one-preset file and CLI flags."""

from __future__ import annotations

import copy
from dataclasses import dataclass
from typing import Any

from arm_common.enums import ContainerFormat
from arm_common.handbrake_schema.effective import UnknownBasePreset, base_preset
from arm_common.handbrake_schema.overlay import FLAG_KEYS
from arm_common.handbrake_schema.reach import family_of_variant
from arm_common.handbrake_schema.types import HandbrakeSchema
from arm_common.schemas.handbrake import HandbrakeSettings

__all__ = ["Materialised", "UnknownBasePreset", "materialise", "resolve_depth"]

_DEFAULT_DEPTH = 8
_FILE_FORMATS: dict[ContainerFormat, str] = {
    ContainerFormat.MKV: "av_mkv",
    ContainerFormat.MP4: "av_mp4",
    ContainerFormat.WEBM: "av_webm",
}
# Keys whose meaning differs per encoder and which HandBrake does not clear on an encoder switch.
_BLOCK_SCALARS = ("VideoQualitySlider", "VideoMultiPass", "VideoTurboMultiPass", "x264UseAdvancedOptions")


@dataclass(frozen=True)
class Materialised:
    preset_file: dict[str, Any]
    flags: list[str]


def resolve_depth(schema: HandbrakeSchema, family: str, preset_ref: str | None, block: dict[str, Any]) -> int:
    """R2: the block's ``bit_depth``; else the base's depth when its encoder is in ``family``; else 8."""
    if "bit_depth" in block:
        depth: int = block["bit_depth"]
        return depth
    encoder = base_preset(schema, preset_ref).get("VideoEncoder")
    if encoder is None or family not in family_of_variant(schema, encoder):
        return _DEFAULT_DEPTH
    return next(v.depth for v in schema.families[family].variants.values() if v.encoder == encoder)


def _start_from_base(schema: HandbrakeSchema, preset_ref: str | None) -> dict[str, Any]:
    return copy.deepcopy(base_preset(schema, preset_ref))


def _layer_common(preset: dict[str, Any], settings: HandbrakeSettings) -> None:
    preset.update(copy.deepcopy(settings.common))


def _apply_arm_keys(preset: dict[str, Any], container: ContainerFormat) -> None:
    preset.update(PresetName="arm", Type=1, FileFormat=_FILE_FORMATS[container], VideoHWDecode=0)


def _apply_block_scalars(preset: dict[str, Any], block: dict[str, Any]) -> None:
    preset.update({key: block[key] for key in _BLOCK_SCALARS if key in block})


def _encoder_flags(schema: HandbrakeSchema, family: str, preset_ref: str | None, block: dict[str, Any]) -> list[str]:
    depth = resolve_depth(schema, family, preset_ref, block)
    flags = ["--encoder", schema.families[family].variants[depth].encoder]
    for key, flag in FLAG_KEYS.items():
        if key in block:
            flags += [flag, str(block[key])]
    return flags


def materialise(
    schema: HandbrakeSchema,
    preset_ref: str | None,
    settings: HandbrakeSettings,
    family: str | None,
    container: ContainerFormat,
) -> Materialised:
    """The one-preset file and ``--encoder*`` flags for ``family`` (None: the ``preset`` encoder, no flags).

    Does not validate; callers validate first.
    """
    block = settings.encoders.get(family, {}) if family is not None else {}
    preset = _start_from_base(schema, preset_ref)
    _layer_common(preset, settings)
    _apply_arm_keys(preset, container)
    _apply_block_scalars(preset, block)
    major, minor, micro = schema.preset_version
    preset_file = {"PresetList": [preset], "VersionMajor": major, "VersionMinor": minor, "VersionMicro": micro}
    flags = [] if family is None else _encoder_flags(schema, family, preset_ref, block)
    return Materialised(preset_file, flags)

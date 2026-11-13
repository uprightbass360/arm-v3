"""The one-preset file a HandBrake encode imports when its preset carries HandBrake settings (spec 4.7).

Deciding whether a preset has settings, checking them against the image's
baked schema (M5), materialising the file and flags, and writing the file
are separate functions; `main` owns the temp directory and the launch.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from arm_common.encoders import EncoderSpec
from arm_common.handbrake_schema.materialise import Materialised, materialise
from arm_common.handbrake_schema.types import HandbrakeSchema
from arm_common.handbrake_schema.validate import validate_family
from arm_common.schemas import TranscodePresetView
from arm_common.schemas.handbrake import HandbrakeSettings, SettingIssue

from arm_transcode.schema_file import load_baked_schema

PRESET_FILE_NAME = "arm-preset.json"
NO_SCHEMA_MESSAGE = "this transcode image has no HandBrake schema; rebuild or pull it"


class SettingsRejected(RuntimeError):
    """The preset's settings are invalid for the resolved encoder family; raised before HandBrake launches."""

    def __init__(self, issues: list[SettingIssue]) -> None:
        super().__init__("HandBrake settings rejected: " + "; ".join(issue.message for issue in issues))


def has_settings(preset: TranscodePresetView) -> bool:
    """True when the preset carries any HandBrake settings, so it runs from a materialised preset file."""
    return preset.handbrake_settings is not None and not preset.handbrake_settings.is_empty()


def family_of(spec: EncoderSpec | None) -> str | None:
    """The HandBrake encoder family the resolved spec runs; None for the preset's own encoder."""
    return None if spec is None else spec.engine_encoder


def require_baked_schema() -> HandbrakeSchema:
    """The image's baked schema; a settings run cannot proceed without one."""
    schema = load_baked_schema()
    if schema is None:
        raise RuntimeError(NO_SCHEMA_MESSAGE)
    return schema


def check_family(
    schema: HandbrakeSchema, family: str | None, preset_ref: str | None, settings: HandbrakeSettings
) -> None:
    """M5: raise `SettingsRejected` when the settings are invalid for `family`. No family (preset encoder): no check."""
    if family is None:
        return
    issues = validate_family(schema, family=family, preset_ref=preset_ref, settings=settings)
    if issues:
        raise SettingsRejected(issues)


def materialise_for_encode(preset: TranscodePresetView, spec: EncoderSpec | None) -> Materialised:
    """Validate the preset's settings for the resolved family, then build the preset file and encoder flags.

    Raises `SettingsRejected`, `UnknownBasePreset`, or `RuntimeError` when the image has no schema.
    """
    settings = preset.handbrake_settings or HandbrakeSettings()
    schema = require_baked_schema()
    family = family_of(spec)
    check_family(schema, family, preset.preset_ref, settings)
    return materialise(schema, preset.preset_ref, settings, family, preset.container)


def write_preset_file(work_dir: Path, preset_file: dict[str, Any]) -> Path:
    """Write the preset file as `arm-preset.json` in `work_dir` and return its path."""
    path = work_dir / PRESET_FILE_NAME
    path.write_text(json.dumps(preset_file))
    return path

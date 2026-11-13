"""Wire models of a transcode preset's HandBrake settings and of the issues validation reports."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from arm_common.enums import ContainerFormat

IssueCode = Literal[
    "unknown_key",
    "not_allowed_here",
    "wrong_type",
    "not_in_list",
    "out_of_range",
    "encoder_not_reachable",
    "engine_ignores_settings",
    "not_supported_by_encoder",
]


class SettingIssue(BaseModel):
    """One reason a setting is rejected. ``encoder`` names the block it sits in; None for ``common``."""

    key: str
    encoder: str | None = None
    code: IssueCode
    message: str


class HandbrakeSettings(BaseModel):
    """Settings every encoder shares (``common``) plus one block per encoder family (``encoders``)."""

    common: dict[str, Any] = Field(default_factory=dict)
    encoders: dict[str, dict[str, Any]] = Field(default_factory=dict)

    def is_empty(self) -> bool:
        return not self.common and not any(self.encoders.values())


class ImportProposal(BaseModel):
    """The preset an import would create from one HandBrake export entry."""

    name: str
    container: ContainerFormat
    encoder: str
    handbrake_settings: HandbrakeSettings


class ImportedPresetView(BaseModel):
    """One export entry as the review step shows it: the proposal plus everything the import changed."""

    path: list[str]
    name: str
    proposal: ImportProposal | None
    source_encoder: str
    dropped_keys: list[str]
    not_imported: list[str]
    copied_depth_to: list[str]
    eight_bit_only: list[str]
    warnings: list[str]
    issues: list[SettingIssue]
    importable: bool
    reason: str | None = None


class ImportParseResponse(BaseModel):
    handbrake_version: dict[str, str]
    presets: list[ImportedPresetView]

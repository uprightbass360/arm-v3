"""Wire models of a transcode preset's HandBrake settings and of the issues validation reports."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

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

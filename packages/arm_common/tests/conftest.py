"""Shared fixtures for the arm_common suite: the committed HandBrake schema dump and a Plex export."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest

from arm_common.handbrake_schema.loader import load_schema
from arm_common.handbrake_schema.types import HandbrakeSchema

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture(scope="session")
def hb_raw() -> dict[str, Any]:
    """The raw libhb schema dump for HandBrake 1.11.1 (treat as read-only; deepcopy to mutate)."""
    return json.loads((FIXTURES / "handbrake-schema-1.11.1.json").read_text())


@pytest.fixture(scope="session")
def hb_schema(hb_raw: dict[str, Any]) -> HandbrakeSchema:
    return load_schema(hb_raw)


@pytest.fixture(scope="session")
def plex_export() -> Any:
    """A real GUI export of a custom Plex 720p preset."""
    return json.loads((FIXTURES / "handbrake-export-custom-plex-720p.json").read_text())

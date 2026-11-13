"""Shared HandBrake schema test data: the committed 1.11.1 dump, loaded once per process."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from arm_common.handbrake_schema.loader import load_schema
from arm_common.handbrake_schema.types import HandbrakeSchema

_FIXTURE = (
    Path(__file__).resolve().parents[3]
    / "packages"
    / "arm_common"
    / "tests"
    / "fixtures"
    / "handbrake-schema-1.11.1.json"
)


@lru_cache(maxsize=1)
def fixture_raw() -> dict[str, Any]:
    return json.loads(_FIXTURE.read_text())


@lru_cache(maxsize=1)
def fixture_schema() -> HandbrakeSchema:
    return load_schema(fixture_raw())

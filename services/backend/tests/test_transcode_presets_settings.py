"""Transcode-preset HandBrake settings: stored whole on create and patch, and
`preset_json` is gone from the wire."""

from __future__ import annotations

import secrets

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from arm_backend.db import get_session
from arm_backend.jwt_utils import issue_access_token
from arm_backend.routers import transcode_presets as tp_router
from arm_common import ContainerFormat, MediaType, TranscodePreset, TranscodeTool, User

from tests._fakes import FakeSession

_SETTINGS = {
    "common": {
        "PictureWidth": 1280,
        "PictureHeight": 720,
        "VideoFramerateMode": "cfr",
        "AudioList": [{"AudioEncoder": "av_aac", "AudioMixdown": "5point1", "AudioBitrate": 384}],
    },
    "encoders": {"x265": {"VideoPreset": "slow", "VideoQualitySlider": 20}},
}

_BODY = {
    "name": "Plex 720p",
    "media_type": "movie",
    "tool": "handbrake",
    "container": "mkv",
    "handbrake_settings": _SETTINGS,
}


@pytest.fixture
def signing_key() -> bytes:
    return secrets.token_bytes(32)


def _make_app(signing_key: bytes, db: FakeSession) -> tuple[FastAPI, dict[str, str]]:
    app = FastAPI()
    app.state.signing_key = signing_key
    app.include_router(tp_router.router)

    async def _override_session() -> FakeSession:
        return db

    app.dependency_overrides[get_session] = _override_session
    db.rows.setdefault("users", []).append(
        User(id="usr_admin", username="admin", password_hash="x", password_must_change=False)
    )
    token, _ = issue_access_token("usr_admin", "admin", signing_key)
    return app, {"Authorization": f"Bearer {token}"}


def _stored(settings: dict | None) -> TranscodePreset:
    return TranscodePreset(
        id="tpr_s",
        name="s",
        media_type=MediaType.MOVIE,
        is_builtin=False,
        tool=TranscodeTool.HANDBRAKE,
        container=ContainerFormat.MKV,
        handbrake_settings=settings,
    )


def test_create_round_trips_settings(signing_key: bytes) -> None:
    db = FakeSession()
    app, headers = _make_app(signing_key, db)
    with TestClient(app) as client:
        r = client.post("/api/transcode-presets", json=_BODY, headers=headers)
    assert r.status_code == 201
    assert r.json()["handbrake_settings"] == {
        "common": _SETTINGS["common"],
        "encoders": _SETTINGS["encoders"],
    }
    assert r.json()["issues"] == []
    assert r.json()["host_notes"] == []
    assert db.rows["transcode_presets"][0].handbrake_settings == r.json()["handbrake_settings"]


def test_create_without_settings_stores_null(signing_key: bytes) -> None:
    db = FakeSession()
    app, headers = _make_app(signing_key, db)
    body = {k: v for k, v in _BODY.items() if k != "handbrake_settings"}
    with TestClient(app) as client:
        r = client.post("/api/transcode-presets", json=body, headers=headers)
    assert r.status_code == 201
    assert r.json()["handbrake_settings"] is None


def test_patch_replaces_settings_whole(signing_key: bytes) -> None:
    db = FakeSession()
    app, headers = _make_app(signing_key, db)
    db.rows["transcode_presets"] = [_stored(_SETTINGS)]
    with TestClient(app) as client:
        r = client.patch(
            "/api/transcode-presets/tpr_s",
            json={"handbrake_settings": {"common": {"PictureWidth": 640}}},
            headers=headers,
        )
    assert r.status_code == 200
    assert r.json()["handbrake_settings"] == {"common": {"PictureWidth": 640}, "encoders": {}}


def test_patch_null_clears(signing_key: bytes) -> None:
    db = FakeSession()
    app, headers = _make_app(signing_key, db)
    db.rows["transcode_presets"] = [_stored(_SETTINGS)]
    with TestClient(app) as client:
        r = client.patch("/api/transcode-presets/tpr_s", json={"handbrake_settings": None}, headers=headers)
    assert r.status_code == 200
    assert r.json()["handbrake_settings"] is None


def test_view_has_no_preset_json(signing_key: bytes) -> None:
    db = FakeSession()
    app, headers = _make_app(signing_key, db)
    db.rows["transcode_presets"] = [_stored(None)]
    with TestClient(app) as client:
        r = client.get("/api/transcode-presets/tpr_s", headers=headers)
    assert "preset_json" not in r.json()
    assert not hasattr(TranscodePreset, "preset_json")

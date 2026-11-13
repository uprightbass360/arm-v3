"""The HandBrakeCLI argv the transcoder launches, with and without a preset's HandBrake settings."""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any

import pytest

import arm_transcode.main as m
from arm_common import ContainerFormat, MediaType, TranscodeTool
from arm_common.schemas import TranscodePresetView
from arm_transcode.heartbeat import ProgressState


class _Proc:
    """A HandBrakeCLI run that exits 0 at once with no output."""

    def __init__(self) -> None:
        self.stdout = asyncio.StreamReader()
        self.stdout.feed_eof()
        self.stderr = asyncio.StreamReader()
        self.stderr.feed_eof()

    async def wait(self) -> int:
        return 0


class _Spawns:
    """Records each launched argv and writes the output file HandBrake would."""

    def __init__(self) -> None:
        self.argvs: list[list[str]] = []

    async def __call__(self, *argv: str, **_kwargs: Any) -> _Proc:
        self.argvs.append(list(argv))
        Path(argv[argv.index("-o") + 1]).write_bytes(b"x")
        return _Proc()


@pytest.fixture
def spawns(monkeypatch: pytest.MonkeyPatch) -> _Spawns:
    recorder = _Spawns()
    monkeypatch.setattr(asyncio, "create_subprocess_exec", recorder)
    return recorder


def _preset(**update: Any) -> TranscodePresetView:
    base = TranscodePresetView(
        id="tpr_builtin_plex_1080p_h265",
        name="Plex 1080p H.265",
        media_type=MediaType.MOVIE,
        is_builtin=True,
        tool=TranscodeTool.HANDBRAKE,
        preset_ref="H.265 MKV 1080p30",
        handbrake_settings=None,
        container=ContainerFormat.MKV,
        encoder="cpu_h265",
        extra_args=None,
        created_by_user_id=None,
        created_at=None,
        updated_at=None,
    )
    return base.model_copy(update=update)


async def _run(tmp_path: Path, preset: TranscodePresetView) -> int:
    return await m._run_encoder(
        tool=TranscodeTool.HANDBRAKE,
        preset=preset,
        raw_input=tmp_path / "in.mkv",
        final_output=tmp_path / "out.mkv",
        duration_seconds=100,
        state=ProgressState(),
        cancel_event=asyncio.Event(),
    )


@pytest.mark.asyncio
async def test_no_settings_argv_is_todays(monkeypatch, tmp_path, spawns) -> None:
    """M11: the builtin Plex H.265 preset launches exactly today's argv."""
    monkeypatch.setenv("ARM_TRANSCODE_ENCODER", "cpu_h265")
    await _run(tmp_path, _preset(extra_args="--quality 20"))
    assert spawns.argvs == [
        [
            "HandBrakeCLI",
            "-i",
            str(tmp_path / "in.mkv"),
            "-o",
            str(tmp_path / "out.mkv.arm-inprogress"),
            "--preset",
            "H.265 MKV 1080p30",
            "--encoder",
            "x265",
            "--quality",
            "20",
        ]
    ]

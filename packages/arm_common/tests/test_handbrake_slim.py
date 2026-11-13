"""The slim HandBrake schema view served to the UI."""

from __future__ import annotations

from arm_common.handbrake_schema.overlay import ARM_OWNED_KEYS, ENCODER_SPECIFIC_KEYS
from arm_common.handbrake_schema.slim import slim_view


def test_slim_has_no_builtin_values(hb_schema):
    view = slim_view(hb_schema)
    assert len(view.builtin_names) == 106
    assert all(isinstance(n, str) for n in view.builtin_names)
    assert not any(isinstance(k.default, dict) and "PresetName" in k.default for k in view.keys)
    assert "PresetList" not in view.model_dump_json()


def test_slim_size_under_60kb(hb_schema):
    assert len(slim_view(hb_schema).model_dump_json()) < 60_000


def test_slim_family_carries_quality_name(hb_schema):
    family = next(f for f in slim_view(hb_schema).families if f.name == "nvenc_h264")
    variant = next(v for v in family.variants if v.depth == 8)
    assert variant.quality.name == "CQ"


def test_slim_mirrors_the_schema(hb_schema):
    view = slim_view(hb_schema)
    assert view.preset_version == "72.0.0"
    assert [k.name for k in view.keys] == list(hb_schema.keys)
    assert [k.name for k in view.audio_item_keys] == list(hb_schema.audio_item_keys)
    assert any(k.source is not None for k in view.keys)
    assert any(k.source is None for k in view.keys)
    assert view.audio_mixdowns_by_encoder
    assert "audio_mixdowns_by_encoder" not in view.lists
    assert set(view.filters) == set(hb_schema.filters)
    assert all(isinstance(f.rate_controls, list) for f in view.families)


def test_slim_carries_static_enums_and_source_extras(hb_schema):
    view = slim_view(hb_schema)
    assert view.static_enums["AudioTrackSelectionBehavior"] == ["none", "first", "all"]
    assert "VideoFramerateMode" in view.static_enums
    assert "auto" in view.source_extras["AudioSamplerate"]
    assert view.source_extras["AudioBitrate"] == [-1]
    used = {k.source.ref for k in view.keys if k.source and k.source.kind == "static"}
    assert used <= set(view.static_enums)


def test_slim_carries_selector_filter_aliases(hb_schema):
    assert slim_view(hb_schema).selector_filter_aliases == {"deinterlace": "yadif"}


def test_slim_carries_arm_owned_and_encoder_specific_keys(hb_schema):
    view = slim_view(hb_schema)
    assert view.arm_owned_keys == sorted(ARM_OWNED_KEYS)
    assert view.encoder_specific_keys == sorted(ENCODER_SPECIFIC_KEYS)
    assert "VideoHWDecode" in view.arm_owned_keys
    assert "VideoQualitySlider" in view.encoder_specific_keys

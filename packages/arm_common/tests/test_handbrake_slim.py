"""The slim HandBrake schema view served to the UI."""

from __future__ import annotations

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

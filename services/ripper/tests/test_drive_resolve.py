"""Drive resolution: serial -> current node, with fallback to the configured path."""

from pathlib import Path

from arm_ripper.drive_resolve import resolve_drive_device

SERIAL = "AAAABBBB000E"
LINK_NAME = f"usb-PIONEER_BD-RW_BDR-S12JX_{SERIAL}-0:0"


def _make_dev_tree(tmp_path: Path, *, node: str = "sr0", link: str | None = LINK_NAME) -> Path:
    """Build a fake /dev with a real node and (optionally) a by-id symlink."""
    dev = tmp_path / "dev"
    by_id = dev / "disk" / "by-id"
    by_id.mkdir(parents=True)
    node_path = dev / node
    node_path.touch()
    if link is not None:
        (by_id / link).symlink_to(Path("..") / ".." / node)
    return dev


def test_serial_resolves_to_the_node_the_by_id_link_points_at(tmp_path: Path) -> None:
    dev = _make_dev_tree(tmp_path, node="sr0")
    assert resolve_drive_device(str(dev / "sr0"), SERIAL, dev_root=dev) == str(dev / "sr0")


def test_serial_wins_when_the_drive_renumbered(tmp_path: Path) -> None:
    """The whole point: configured sr0 is stale, the drive is now sr2."""
    dev = _make_dev_tree(tmp_path, node="sr2")
    resolved = resolve_drive_device(str(dev / "sr0"), SERIAL, dev_root=dev)
    assert resolved == str(dev / "sr2")


def test_no_serial_returns_the_configured_path_untouched(tmp_path: Path) -> None:
    dev = _make_dev_tree(tmp_path)
    assert resolve_drive_device("/dev/sr0", None, dev_root=dev) == "/dev/sr0"
    assert resolve_drive_device("/dev/sr0", "", dev_root=dev) == "/dev/sr0"


def test_missing_by_id_dir_falls_back(tmp_path: Path) -> None:
    dev = tmp_path / "dev"
    dev.mkdir()
    assert resolve_drive_device("/dev/sr0", SERIAL, dev_root=dev) == "/dev/sr0"


def test_serial_not_present_among_links_falls_back(tmp_path: Path) -> None:
    dev = _make_dev_tree(tmp_path, link="usb-SOME_OTHER_DRIVE_ZZZZ9999-0:0")
    assert resolve_drive_device("/dev/sr0", SERIAL, dev_root=dev) == "/dev/sr0"


def test_dangling_by_id_link_falls_back(tmp_path: Path) -> None:
    """Drive unplugged: the link may linger briefly with no target."""
    dev = tmp_path / "dev"
    by_id = dev / "disk" / "by-id"
    by_id.mkdir(parents=True)
    (by_id / LINK_NAME).symlink_to(Path("..") / ".." / "sr9-gone")
    assert resolve_drive_device("/dev/sr0", SERIAL, dev_root=dev) == "/dev/sr0"


def test_only_the_matching_serial_is_selected(tmp_path: Path) -> None:
    """Two drives present; we must pick ours, not the first link listed."""
    dev = tmp_path / "dev"
    by_id = dev / "disk" / "by-id"
    by_id.mkdir(parents=True)
    (dev / "sr0").touch()
    (dev / "sr1").touch()
    # Sorts before ours, so a naive "first link" implementation fails here.
    (by_id / "usb-AAA_OTHER_DRIVE_0000ZZZZ-0:0").symlink_to(Path("..") / ".." / "sr0")
    (by_id / LINK_NAME).symlink_to(Path("..") / ".." / "sr1")
    assert resolve_drive_device(str(dev / "sr0"), SERIAL, dev_root=dev) == str(dev / "sr1")

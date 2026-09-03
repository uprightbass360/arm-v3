"""Resolve this ripper's optical drive to a device node at open time.

Why this exists: the kernel assigns `srN` by enumeration order, so a drive
unplugged and replugged (or a host rebooted with two drives) can come back
under a different number. `ARM_DRIVE_DEV` is captured once at
compose-generation time, so trusting it blindly can point a ripper at a
*different* physical drive.

`ARM_DRIVE_SERIAL` (udev `ID_SERIAL_SHORT`, captured by the installer) is
stable across replug and renumbering. udev encodes it into the
`/dev/disk/by-id/` symlink name, so we can find the drive's current node by
scanning those links for one whose name contains the serial — no udev
runtime, no privileged access, just a readlink.

Resolution order:
  1. serial match under /dev/disk/by-id (authoritative when available)
  2. the configured ARM_DRIVE_DEV node (unchanged legacy behaviour)

The fallback keeps drives that report no serial working exactly as before,
and keeps this a pure addition: with no serial configured the function
returns the configured path untouched.
"""

import os
from pathlib import Path

# Where udev publishes stable device symlinks. Overridable so the container
# can point at a bind-mounted host /dev (see the ripper compose block) and
# so tests can supply a fixture tree.
DEV_ROOT = Path(os.environ.get("ARM_DEV_ROOT", "/dev"))

_BY_ID_SUBDIR = "disk/by-id"


def _by_id_dir(dev_root: Path) -> Path:
    return dev_root / _BY_ID_SUBDIR


def resolve_drive_device(configured_path: str, serial: str | None, *, dev_root: Path | None = None) -> str:
    """Return the device node to open for this ripper's drive.

    `configured_path` is ARM_DRIVE_DEV (e.g. `/dev/sr0`); `serial` is
    ARM_DRIVE_SERIAL. When a serial is known and a `/dev/disk/by-id/` link
    carrying it resolves to an existing node, that node wins — it tracks the
    drive across renumbering. Otherwise `configured_path` is returned
    unchanged, so hosts without by-id links (or drives with no serial)
    behave exactly as they did before.

    Never raises: resolution is best-effort, and the caller's existing
    OSError handling covers a device that is genuinely absent.
    """
    if not serial:
        return configured_path

    root = dev_root if dev_root is not None else DEV_ROOT
    by_id = _by_id_dir(root)
    try:
        entries = sorted(by_id.iterdir())
    except OSError:
        return configured_path

    for entry in entries:
        # udev builds these names as <bus>-<model>_<serial>[-<lun>]; matching
        # on the serial substring avoids depending on the surrounding format,
        # which differs between usb/ata/scsi links for the same drive.
        if serial not in entry.name:
            continue
        try:
            target = entry.resolve(strict=True)
        except OSError:
            continue
        if target.exists():
            return str(target)

    return configured_path

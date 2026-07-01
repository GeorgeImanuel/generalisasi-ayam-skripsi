from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run(script: str) -> None:
    print(f"\n=== {script} ===")
    subprocess.run([sys.executable, str(ROOT / "scripts" / script)], check=True, cwd=ROOT)


def main() -> None:
    run("audit_dataset.py")
    run("extract_bbox_features.py")
    run("estimate_weight_anomalies.py")
    run("compare_camera_corrections.py")
    run("xue_light_calibration.py")
    run("image_level_anomaly.py")
    print("\nDone. Open reports/anomaly_report.html")


if __name__ == "__main__":
    main()
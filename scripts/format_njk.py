from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


def format_file(file_path: Path) -> tuple[int, str]:
    command = [
        sys.executable,
        "-m",
        "djlint",
        str(file_path),
        "--reformat",
        "--profile=nunjucks",
        "--extension=njk",
        "--indent=2",
        "--quiet",
    ]
    result = subprocess.run(
        command,
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    return result.returncode, result.stdout


def main() -> int:
    files = sorted(SRC.rglob("*.njk"))

    if not files:
        print("No .njk files found.")
        return 0

    failed = []

    for file_path in files:
        print(f"Formatting {file_path.relative_to(ROOT)}")
        code, output = format_file(file_path)

        if code != 0:
            failed.append((file_path, output))

    if failed:
        print("\nFailed to format:")
        for file_path, output in failed:
            print(file_path.relative_to(ROOT))
            if output.strip():
                print(output.strip())
        return 1

    print("\nAll .njk files formatted.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from pathlib import Path
from runpy import run_path

for script in (
    'tools/apply_premium_core_r2_second_pass_v2.py',
    'tools/apply_premium_core_r2_capture_freeze.py',
):
    try:
        run_path(script, run_name='__main__')
    except SystemExit as exc:
        if exc.code not in (0, None):
            raise

third = Path('tools/apply_premium_core_r2_third_pass.py')
source = third.read_text(encoding='utf-8').replace("    'kernel aperture')\\nanchor=", "    'kernel aperture')\nanchor=")
try:
    exec(compile(source, str(third), 'exec'), {'__name__': '__main__', '__file__': str(third)})
except SystemExit as exc:
    if exc.code not in (0, None):
        raise

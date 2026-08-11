from runpy import run_path

for script in (
    'tools/apply_premium_core_r2_second_pass_v2.py',
    'tools/apply_premium_core_r2_capture_freeze.py',
    'tools/apply_premium_core_r2_third_pass.py',
):
    try:
        run_path(script, run_name='__main__')
    except SystemExit as exc:
        if exc.code not in (0, None):
            raise

from runpy import run_path

try:
    run_path('tools/apply_premium_core_r2_second_pass_v2.py', run_name='__main__')
except SystemExit as exc:
    if exc.code not in (0, None):
        raise

run_path('tools/apply_premium_core_r2_capture_freeze.py', run_name='__main__')

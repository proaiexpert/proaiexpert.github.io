$ErrorActionPreference = "Stop"
python scripts/apply-social-preview-defaults.py --mode check-source --root .
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Output "Social preview + Favicon R2 source authority check passed."

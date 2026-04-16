Site baseline and freeze policy

Baseline rule:
If the current version works on main routes and mobile menu/header are stable, treat it as the working baseline.

Freeze rule:
After final stabilization:
- no general cleanup
- no full-site audits
- no architecture polishing
- no broad refactors
- only real business changes later

Required smoke test before push:
- /
- /ru/
- /contact/
- /ru/contact/
- mobile menu
- desktop header
- one CTA / one form path
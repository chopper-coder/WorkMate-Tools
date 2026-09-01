from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]

def read_required(path: Path) -> str:
    if not path.exists():
        print(f"ERROR Missing required file: {path.relative_to(root)}", file=sys.stderr)
        sys.exit(1)
    return path.read_text(encoding="utf-8")

app = read_required(root / "app.js")
html = read_required(root / "index.html")
loader = read_required(root / "sheetjs-loader.js")
workflow = read_required(root / ".github" / "workflows" / "deploy.yml")

checks = []

def ck(name, cond):
    checks.append((name, bool(cond)))

# ─────────────────────────────────────────────
# Core tool inventory
# ─────────────────────────────────────────────
ck(
    "24 core tools",
    len(re.findall(r"^addTool\('", app, re.M)) == 24
)

# ─────────────────────────────────────────────
# CSP / HTML security
# ─────────────────────────────────────────────
ck("CSP has no unsafe-inline", "unsafe-inline" not in html)
ck("CSP connect-src none", "connect-src 'none'" in html)
ck(
    "No inline style attributes in HTML",
    'style="' not in html and "style='" not in html
)
ck(
    "No inline style attributes in app templates",
    'style="' not in app and "style='" not in app
)
ck(
    "No element.style mutation",
    not re.search(r"\.style(?:\.|\s*=)", app)
)

# ─────────────────────────────────────────────
# Risky APIs
# ─────────────────────────────────────────────
for token in [
    "eval(",
    "new Function",
    "document.write",
    "fetch(",
    "XMLHttpRequest",
    "WebSocket",
    "sendBeacon",
]:
    ck(f"No risky API: {token}", token not in app)

ck("No XLSX.writeFile bypass", "XLSX.writeFile" not in app)

# ─────────────────────────────────────────────
# Export workflow
# ─────────────────────────────────────────────
ck(
    "Export preview modal exists",
    'id="exportModal"' in html and "showExportPreview" in app
)

# ─────────────────────────────────────────────
# SheetJS runtime
# ─────────────────────────────────────────────
ck(
    "Runtime SheetJS is local-first with fixed official fallback",
    '<script src="vendor/xlsx.full.min.js"></script>' in html
    and "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js" in loader
    and "sha384-" in loader
    and "unpkg.com" not in loader
    and "jsdelivr.net" not in loader
)

# ─────────────────────────────────────────────
# Annotation project / recovery
# ─────────────────────────────────────────────
ck(
    "Annotation project schema exists",
    "workmate.annotation" in app
    and "iaProjectSave" in app
    and "iaProjectOpen" in app
)

ck(
    "V1.7 recovery database",
    "workmate_tools_recovery_v1" in app
    and "draftPut" in app
    and "draftGet" in app
)

ck(
    "V1.7 annotation lock",
    "iaLock" in app
    and "locked" in app
)

# ─────────────────────────────────────────────
# Excel data integrity
# ─────────────────────────────────────────────
ck("Excel cellFormula enabled", "cellFormula:true" in app)
ck("Excel cellDates enabled", "cellDates:true" in app)
ck("Excel cellNF enabled", "cellNF:true" in app)

ck(
    "Formula default block",
    'value="block" checked' in app
)

ck(
    "V1.7 Excel type profile",
    "excelIntegrityProfile" in app
    and "型別混合欄" in app
)

# ─────────────────────────────────────────────
# Removed / low-value tools
# ─────────────────────────────────────────────
ck(
    "No hidden low-value tools",
    all(
        token not in app
        for token in [
            "addTool('file-hash'",
            "addTool('uuid'",
            "addTool('json-format'",
            "addTool('password'",
            "addTool('notes'",
        ]
    )
)

# ─────────────────────────────────────────────
# V1.7 workflow safety
# ─────────────────────────────────────────────
ck(
    "V1.7 cancelable QR",
    "qrCancel" in app and "qrProgress" in app
)

ck(
    "V1.7 cancelable image compression",
    "icCancel" in app and "icProgress" in app
)

ck(
    "V1.7 raffle alternates",
    "rfAltCount" in app and "rfFullscreen" in app
)

ck(
    "V1.7 no silent list dedupe",
    "rgDedupe" in app and "rfDedupe" in app
)

# ─────────────────────────────────────────────
# Number uppercase
# ─────────────────────────────────────────────
ck(
    "Number uppercase tool exists",
    "addTool('number-uppercase'" in app
    and "OfficeNumberUppercase.convert" in app
)

# ─────────────────────────────────────────────
# GitHub Pages deployment package
# ─────────────────────────────────────────────

# Runtime helper scripts must be copied into _site.
helper_scripts_ok = (
    "sheetjs-loader.js" in workflow
    and "number-uppercase.js" in workflow
)

# Support both:
#   touch _site/.nojekyll
# and the older:
#   cp ... .nojekyll _site/
nojekyll_ok = (
    "touch _site/.nojekyll" in workflow
    or re.search(r"\bcp\b[^\n]*\.nojekyll[^\n]*_site/", workflow) is not None
)

ck(
    "Pages package includes runtime helper scripts",
    helper_scripts_ok and nojekyll_ok
)

ck(
    "Pages package includes all local runtime vendor files",
    all(
        token in workflow
        for token in [
            "vendor/xlsx.full.min.js",
            "vendor/jszip.min.js",
            "vendor/workmate-qr.js",
        ]
    )
)

ck(
    "Pages package includes main runtime files",
    all(
        token in workflow
        for token in [
            "index.html",
            "app.js",
            "styles.css",
        ]
    )
)

ck(
    "Pages artifact uploads _site",
    "actions/upload-pages-artifact@v3" in workflow
    and "path: _site" in workflow
)

ck(
    "Pages deployment uses deploy-pages",
    "actions/deploy-pages@v4" in workflow
)

# ─────────────────────────────────────────────
# Results
# ─────────────────────────────────────────────
failed = [name for name, ok in checks if not ok]

for name, ok in checks:
    print(("PASS" if ok else "FAIL"), name)

if failed:
    print(
        "FAILED: " + ", ".join(failed),
        file=sys.stderr
    )
    sys.exit(1)

print(f"PASS {len(checks)}/{len(checks)} static checks")

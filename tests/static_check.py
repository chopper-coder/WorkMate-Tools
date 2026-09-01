from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
app=(root/'app.js').read_text(encoding='utf-8')
html=(root/'index.html').read_text(encoding='utf-8')
checks=[]
def ck(name, cond):
    checks.append((name,bool(cond)))
ck('24 core tools', len(re.findall(r"^addTool\('",app,re.M))==24)
ck('CSP has no unsafe-inline', 'unsafe-inline' not in html)
ck('CSP connect-src none', "connect-src 'none'" in html)
ck('No inline style attributes in HTML', 'style="' not in html and "style='" not in html)
ck('No inline style attributes in app templates', 'style="' not in app and "style='" not in app)
ck('No element.style mutation', not re.search(r'\.style(?:\.|\s*=)',app))
for token in ['eval(', 'new Function', 'document.write', 'fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon']:
    ck(f'No risky API: {token}', token not in app)
ck('No XLSX.writeFile bypass', 'XLSX.writeFile' not in app)
ck('Export preview modal exists', 'id="exportModal"' in html and 'showExportPreview' in app)
loader=(root/'sheetjs-loader.js').read_text(encoding='utf-8')
ck('Runtime SheetJS is local-first with fixed official fallback', '<script src="vendor/xlsx.full.min.js"></script>' in html and 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js' in loader and 'sha384-' in loader and 'unpkg.com' not in loader and 'jsdelivr.net' not in loader)
ck('Annotation project schema exists', 'workmate.annotation' in app and 'iaProjectSave' in app and 'iaProjectOpen' in app)
ck('Excel cellFormula enabled', 'cellFormula:true' in app)
ck('Excel cellDates enabled', 'cellDates:true' in app)
ck('Excel cellNF enabled', 'cellNF:true' in app)
ck('Formula default block', "value=\"block\" checked" in app)
ck('No hidden low-value tools', all(x not in app for x in ["addTool('file-hash'","addTool('uuid'","addTool('json-format'","addTool('password'","addTool('notes'"]))

ck('V1.7 recovery database', 'workmate_tools_recovery_v1' in app and 'draftPut' in app and 'draftGet' in app)
ck('V1.7 annotation lock', 'iaLock' in app and 'locked' in app)
ck('V1.7 Excel type profile', 'excelIntegrityProfile' in app and '型別混合欄' in app)
ck('V1.7 cancelable QR', 'qrCancel' in app and 'qrProgress' in app)
ck('V1.7 cancelable image compression', 'icCancel' in app and 'icProgress' in app)
ck('V1.7 raffle alternates', 'rfAltCount' in app and 'rfFullscreen' in app)
ck('V1.7 no silent list dedupe', 'rgDedupe' in app and 'rfDedupe' in app)
ck('Number uppercase tool exists', "addTool('number-uppercase'" in app and 'OfficeNumberUppercase.convert' in app)
workflow=(root/'.github/workflows/deploy.yml').read_text(encoding='utf-8')
ck('Pages package includes runtime helper scripts', 'sheetjs-loader.js number-uppercase.js .nojekyll _site/' in workflow)
ck('Pages package includes all local runtime vendor files', all(x in workflow for x in ['vendor/xlsx.full.min.js','vendor/jszip.min.js','vendor/workmate-qr.js']))
failed=[name for name,ok in checks if not ok]
for name,ok in checks: print(('PASS' if ok else 'FAIL'),name)
if failed:
    print('FAILED:', ', '.join(failed), file=sys.stderr);sys.exit(1)
print(f'PASS {len(checks)}/{len(checks)} static checks')

# Third-Party Components — WorkMate Tools V1.7

WorkMate Tools 的主程式為專案自有程式碼；下列第三方元件依其原始授權使用。

## SheetJS Community Edition
- Target version: 0.20.3
- Runtime policy: local vendor first; fixed official CDN + SRI only as source-package fallback
- Offline build: `PREPARE_OFFLINE.bat` / `scripts/vendor_sheetjs.sh`
- License/source information: follow the upstream SheetJS project distribution terms bundled with the verified file/source.

## JSZip
- Version: 3.10.1
- Local file: `vendor/jszip.min.js`
- License text: `vendor/JSZip_LICENSE.markdown`

## Office QR engine
- Local file: `vendor/workmate-qr.js`
- Used for client-side QR generation.

No third-party dependency is permitted to receive WorkMate Tools user document contents through an WorkMate Tools backend; processing is performed in the browser.

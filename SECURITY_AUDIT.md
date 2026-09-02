# 🐱 工作喵工具箱｜WorkMate Tools V1.7 Security & Data Integrity Audit

## 結論
本版在目前可執行的靜態、語法、檔案結構與資料完整性檢查中，未發現阻擋發佈的高風險問題。

## 主要安全措施
- CSP 不使用 `unsafe-inline`。
- `connect-src 'none'`；主應用程式不主動使用 fetch/XHR/WebSocket/sendBeacon。
- 無 `eval`、`new Function`、`document.write`。
- 所有下載都經統一輸出預覽/確認層，不使用 `XLSX.writeFile` 直接繞過確認。
- CSV Formula Injection 防護保留。
- 安全檔名處理包含 Windows 禁止字元與保留名稱。
- Excel、圖片、一般檔案皆有單檔/總量/數量或像素/列數限制。

## SheetJS 供應鏈
- Runtime 使用本機 `vendor/xlsx.full.min.js` 優先。
- 若本機檔尚未建置，loader 僅允許固定官方 0.20.3 URL 與固定 SRI，不接受 unpkg/jsDelivr 任意來源。
- GitHub Actions / PREPARE_OFFLINE 會下載並驗證後再使用。

## Excel 資料完整性
- 讀取時啟用 cellFormula / cellDates / cellNF。
- V1.7 額外分析：同欄型別混用、文字型前導 0、日期格、公式格。
- 結構型操作遇到公式預設阻擋，降低列移動造成公式引用失真的風險。
- 若公式缺少可用 cached value，不允許靜默轉成空白值。

## Recovery / IndexedDB
- 圖片標註草稿只存在瀏覽器本機 IndexedDB。
- 草稿設有 schema/version/尺寸/物件數驗證。
- `.workmate` 專案讀取時檢查 schema 與支援版本，並保留 V1.6 向下相容。

## 大量處理與資源耗盡
- Excel 清洗/合併、QR、圖片壓縮提供進度或取消機制。
- 圖片 bitmap/canvas 在切換或完成後主動釋放，降低大量圖片工作造成記憶體累積。

## 本輪限制
本執行環境對 Chromium 的 `file://` 與 `127.0.0.1` 導航回傳 `ERR_BLOCKED_BY_ADMINISTRATOR`，因此無法在此工作階段完成真正瀏覽器 runtime 回歸。這一限制不被計為 PASS；正式 GitHub Actions 保留 Playwright/Chromium 作為部署閘門，瀏覽器測試失敗即不部署。

## Deployment integrity
Final review found and fixed a Pages packaging omission: `sheetjs-loader.js` is now explicitly copied into `_site`, and static tests require the loader plus all three local vendor runtime files before release.


## 數字轉中文大寫模組補充
- 轉換核心為本專案本機 `number-uppercase.js`，不連線、不傳送輸入內容。
- 金額計算使用字串與 `BigInt` 進行「分」位四捨五入，避免 IEEE-754 浮點金額誤差。
- 不使用 `eval` / 動態程式碼執行。
- 限制整數與小數長度，避免異常超長輸入。
- 正式票據／表單格式可能另有規定，UI 已加入核對提醒。


## 姓名遮罩

- 姓名遮罩核心為本機 `name-mask.js`，不連線、不送出姓名。
- 規則只在瀏覽器記憶體中處理：單字姓名完整遮罩；兩字姓名保留第一字；三字以上保留首尾字，中間全部以 `O` 取代。
- 批次輸出仍經由既有「預覽 → 確認 → 下載」流程。

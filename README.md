# 🐱 工作喵工具箱｜WorkMate Tools

**工作喵工具箱（WorkMate Tools）** 是可直接部署到 GitHub Pages 的純前端上班族工具箱，目前包含 **24 個核心工具、6 大分類**。所有文件與圖片處理原則上都在使用者瀏覽器本機完成。

## 主要功能

- **檔案**：批次檔名整理、附件清單、重複檔案檢測
- **Excel**：清洗、合併、拆分、差異比對、指定欄位去重
- **文字**：文字整理、數字轉中文大寫、文字轉表格、日期批次轉換、文字差異、清單比對
- **圖片**：批次壓縮、物件式標註、敏感資訊遮蔽
- **名單**：QR Code、隨機分組、抽籤／抽獎、座位表
- **日期時間**：工作天、工時、期限

## V1.7 重點

- Excel 型別／前導 0／日期／公式風險摘要
- Excel、QR、圖片大量處理進度與取消
- 圖片標註 IndexedDB 自動草稿復原
- 標註物件鎖定與 `.workmate` 專案保存
- 抽籤正取＋候補＋動畫＋全螢幕
- 同名名單預設保留，不再靜默去重
- 數字轉中文大寫與新臺幣金額大寫
- 所有檔案輸出統一「預覽 → 確認 → 下載」
- CSP 不使用 `unsafe-inline`
- GitHub Actions 測試通過後才部署 Pages


## 安全與隱私

- 不使用 `eval`、`new Function`、`document.write`。
- WorkMate Tools 本身不提供檔案上傳伺服器流程。
- CSP 已移除 `unsafe-inline`。
- CSV 輸出保留 Formula Injection 防護。
- Excel、圖片與批次檔案均有大小／數量／記憶體保護。

詳細內容：

- `SECURITY_AUDIT.md`
- `SELF_TEST_REPORT.txt`
- `FILE_HASHES_SHA256.txt`
- `THIRD_PARTY_LICENSES.md`

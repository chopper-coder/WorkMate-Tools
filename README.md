# 🐱 工作喵工具箱｜WorkMate Tools V1.7

這是 **GitHub 網頁直接上傳簡易版**。不含測試資料夾、GitHub Actions 或隱藏檔，適合直接使用 GitHub 網頁的 **Add file → Upload files**。

## 上傳檔案

請把這個資料夾內的所有檔案與 `vendor` 資料夾一起上傳到 Repository 根目錄。

GitHub 根目錄要直接看到：

- `index.html`
- `app.js`
- `styles.css`
- `sheetjs-loader.js`
- `number-uppercase.js`
- `vendor/`

## 啟用 GitHub Pages

1. Repository → **Settings** → **Pages**
2. Source 選 **Deploy from a branch**
3. Branch 選 `main`
4. Folder 選 `/ (root)`
5. 儲存

網站網址通常是：

`https://你的帳號.github.io/WorkMate-Tools/`

## Excel

此簡易版會優先使用 `vendor/xlsx.full.min.js`。若目前仍是 placeholder，會以固定版本＋SRI 從 SheetJS 官方 CDN 載入 0.20.3，因此 GitHub Pages 上可直接使用 Excel 功能。

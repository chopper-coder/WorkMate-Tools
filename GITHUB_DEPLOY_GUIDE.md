# 🐱 工作喵工具箱｜WorkMate Tools GitHub Pages 上傳教學

這個資料夾已整理成 GitHub Pages 專用版本。

## 一、建立 Repository

1. 登入 GitHub。
2. 右上角按 **＋ → New repository**。
3. Repository name 可自行命名，例如：

   `WorkMate-Tools`

4. 建議選 **Public**，最容易直接使用 GitHub Pages。
5. **不要勾選 Add a README file**，因為本套件已經有 README。
6. 按 **Create repository**。

## 二、上傳檔案

解壓縮 `WorkMate_Tools_V1.7.1_GitHub_Full_Upload.zip` 後，會看到：

```text
.github/
samples/
scripts/
tests/
vendor/
index.html
app.js
styles.css
sheetjs-loader.js
number-uppercase.js
name-mask.js
package.json
playwright.config.js
PREPARE_OFFLINE.bat
README.md
GITHUB_DEPLOY_GUIDE.md
SECURITY_AUDIT.md
SELF_TEST_REPORT.txt
THIRD_PARTY_LICENSES.md
FILE_HASHES_SHA256.txt
.nojekyll
.gitignore
```

GitHub Repository 的最外層必須直接看到 `index.html`。

### 用 GitHub 網頁上傳

1. Repository 首頁按 **Add file → Upload files**。
2. 將解壓縮後的**全部檔案與資料夾內容**拖入上傳區。
3. 確認 `.github/workflows/deploy.yml` 也有上傳。
4. Commit message 可輸入：

   `Deploy WorkMate Tools V1.7.1`

5. 按 **Commit changes**。

> 注意：不要只把 ZIP 檔本身上傳到 GitHub。GitHub Pages 不會自動解壓縮 ZIP。

## 三、開啟 GitHub Pages

1. Repository 上方進入 **Settings**。
2. 左側點 **Pages**。
3. 在 **Build and deployment**：
   - Source：選 **GitHub Actions**。
4. 回到上方 **Actions**。
5. 找到：

   `Test and Deploy WorkMate Tools`

6. 等待測試與 Deploy 全部變成綠色勾勾。

## 四、網站網址

部署成功後，Pages 會顯示網址。

格式通常是：

```text
https://<GitHub帳號>.github.io/<Repository名稱>/
```

例如 repository 叫 `WorkMate-Tools`：

```text
https://<GitHub帳號>.github.io/WorkMate-Tools/
```

## 五、第一次 Actions 會做什麼？

Workflow 會自動：

1. 下載官方 SheetJS 0.20.3。
2. 驗證固定 checksum。
3. 安裝固定版 Playwright 測試環境。
4. 執行靜態資安檢查。
5. 執行 Excel 型別／前導 0／日期／公式 round-trip 測試。
6. 執行數字轉中文大寫測試。
7. 執行姓名遮罩測試。
8. 執行 Chromium 回歸測試。
9. 全部通過後建立 `_site`。
10. 只將正式網站 runtime 發布到 GitHub Pages。

如果其中任何測試失敗，網站不會部署新版。

## 六、如果出現 404

依序確認：

1. Repository 根目錄是否真的有 `index.html`。
2. GitHub 預設分支是否為 `main`。
3. `.github/workflows/deploy.yml` 是否存在。
4. **Settings → Pages → Source** 是否為 **GitHub Actions**。
5. **Actions → Test and Deploy WorkMate Tools** 是否全部綠色。
6. 網址最後是否有 Repository 名稱。
7. Repository 名稱大小寫是否輸入正確。

## 七、如果 Actions 失敗

打開失敗的 workflow，查看紅色步驟：

- `Vendor and verify SheetJS 0.20.3`：官方 SheetJS 下載或 checksum 驗證失敗。
- `Static security checks`：程式結構或資安規則不符合。
- `Excel round-trip integrity checks`：Excel 型別／格式／公式保護回歸。
- `Number uppercase conversion checks`：數字轉中文大寫回歸。
- `Name masking checks`：姓名遮罩規則回歸。
- `Browser regression tests`：網站 UI / 功能回歸。

不要略過失敗的測試直接部署，先修正問題再重新執行。

## 八、Windows 完全離線使用

如果不是部署 GitHub Pages，而是要把 WorkMate Tools 放在 Windows 電腦離線使用：

1. 電腦先連網一次。
2. 執行 `PREPARE_OFFLINE.bat`。
3. 腳本會下載並驗證官方 SheetJS 0.20.3。
4. 成功後正式檔會放在：

   `vendor/xlsx.full.min.js`

5. 之後 Excel 功能即可使用本機 SheetJS。

## 九、之後更新版本

未來更新 WorkMate Tools 時：

1. 保留 Repository。
2. 將新版檔案覆蓋／更新到 `main`。
3. GitHub Actions 會自動重新測試。
4. 全部通過後才替換 GitHub Pages 正式網站。

不需要每次重新建立 Pages。

## 中文檔名相容性修正

此修正版已將 `samples/` 內的測試檔名全部改成英文 ASCII，避免 Windows 解壓縮或瀏覽器上傳時出現中文檔名亂碼。

如果你使用 GitHub 網頁手動選檔上傳，請特別確認 `.github/workflows/deploy.yml` 有成功上傳。若不想處理隱藏/自動化資料夾，請改用 `WorkMate_Tools_V1.7.1_GitHub_Full_Upload.zip`，並以 **Deploy from a branch** 發布。

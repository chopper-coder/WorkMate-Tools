# GitHub Pages 簡易上傳教學

這一版特別給「使用 GitHub 網頁上傳」使用，不需要 `.github`、`.nojekyll`、`tests` 或 `scripts`。

1. 建立 Public Repository，例如 `WorkMate-Tools`。
2. 不需要先建立 README。
3. 點 **Add file → Upload files**。
4. 把本資料夾所有檔案與 `vendor` 資料夾拖進 GitHub 上傳頁面。
5. Commit 到 `main`。
6. 到 **Settings → Pages**。
7. Source 選 **Deploy from a branch**。
8. Branch 選 `main`，Folder 選 `/ (root)`。
9. 儲存並等待 Pages 完成。

注意：Repository 根目錄必須直接看到 `index.html`，不能再多包一層資料夾。

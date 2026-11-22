# 使用說明

分成兩部分：使用者怎麼用，以及開發者怎麼維護。

---

## 一、使用者

### 安裝 phub

**Android 手機（Chrome）**

1. 用 Chrome 打開 phub 的網址
2. 點畫面上的「安裝」按鈕，或從 Chrome 選單選「安裝應用程式」
3. 桌面會出現 phub 圖示，點開就是全螢幕的 App

**電腦（Chrome 或 Edge）**

網址列右側會出現安裝圖示，點擊並確認即可。

### 瀏覽專案

- 用上方搜尋欄輸入名稱、描述或標籤
- 點選標籤可以篩選，選多個標籤時，只顯示同時符合的專案
- 點專案卡片進入詳情

### 開啟網站類專案

在詳情頁按「開啟」，網站會在 App 內顯示。如果畫面空白或顯示被拒絕，代表該網站不允許被內嵌，請按「改用新分頁開啟」。

### 下載並安裝 Android 專案

1. 在**手機上**進入專案詳情，確認版本、檔案大小
2. 按「下載」，下載進度會顯示在系統通知欄
3. 第一次安裝時，Android 會提示「基於安全考量，不允許此來源安裝未知應用程式」，點「設定」，開啟對 Chrome 的「允許安裝」開關
4. 回到下載完成的通知，點開 APK，按「安裝」

安全提醒：

- 這些 APK 沒有上架 Google Play，Android 與 Play Protect 可能跳出警告，這是正常現象
- 想確認檔案沒被替換，可比對詳情頁顯示的 SHA-256 校驗碼（見下方）
- 安裝完成後，可以把 Chrome 的「安裝未知應用程式」權限關掉

### 比對校驗碼（選用）

Windows PowerShell：

```powershell
Get-FileHash .\notes.apk -Algorithm SHA256
```

輸出的 Hash 應與詳情頁顯示的完全一致。

### 在電腦上遇到「僅限手機」的專案

畫面會顯示 QR Code，用手機相機掃描，就會跳到該專案的頁面，接著在手機上下載。

### 更新

- phub 本身：有新版本時會提示「點此更新」，點一下即可
- 專案清單：每次打開都會讀取最新的清單
- Android 專案：新版 APK 發佈後，需要回到 phub 重新下載安裝，相同簽署的版本會直接覆蓋更新

---

## 二、開發者

### 第一次設定

1. 建立 GitHub repo，名稱建議為 `phub`
2. 依 [DEPLOYMENT.md](DEPLOYMENT.md) 開啟 GitHub Pages
3. 為你的 Android 專案建立簽署金鑰並妥善保管（見部署文件）

### 新增網站或 React 專案

1. 先把專案部署到 Vercel、Netlify 或 GitHub Pages，取得 `https` 網址
2. 在 `public/projects.json` 新增一筆（欄位見 [DATA-SCHEMA.md](DATA-SCHEMA.md)）
3. 若該網站不允許內嵌，設定 `"openMode": "newtab"`
4. 本機執行 `npm run dev`，確認畫面沒有「資料錯誤」區塊
5. 提交並推上 GitHub，網站會自動重新部署

```bash
git add public/projects.json
git commit -m "add project: my-new-site"
git push
```

### 新增 Android 專案

1. 將專案打包成**已簽署**的 APK
2. 在該專案的 GitHub repo 建立 Release，上傳 APK，**檔名固定**（例如每次都叫 `notes.apk`）
3. 計算校驗碼：

   ```powershell
   Get-FileHash .\notes.apk -Algorithm SHA256
   ```

4. 在 `projects.json` 新增一筆，填入：
   - `apkUrl`：`https://github.com/<帳號>/<repo>/releases/latest/download/notes.apk`
   - `version`、`sha256`、`sizeMB`
5. 本機確認無誤後推上 GitHub

### 更新既有專案

| 專案類型 | 要做的事 |
|---|---|
| 網站、React | 重新部署該專案即可，網址不變，清單不用改 |
| Android | 發佈新的 Release，檔名維持不變，並更新 `projects.json` 裡的 `version`、`sha256`、`sizeMB`、`updatedAt` |

### 下架專案

可直接刪除該筆，或把 `status` 改成 `paused`。

### 推送前的檢查清單

- [ ] 本機畫面沒有「資料錯誤」
- [ ] `npx vitest run` 全部通過
- [ ] 所有網址都是 `https`
- [ ] 檔案裡沒有任何私人網址、金鑰或密碼
- [ ] APK 的 `sha256` 是這一版的，不是舊版的

### 疑難排解

| 症狀 | 可能原因 |
|---|---|
| 整個清單空白 | `projects.json` 語法錯誤（多餘逗號、單引號），用 VS Code 檢查 |
| 少了一個專案 | 該筆驗證失敗，看畫面上的「資料錯誤」區塊 |
| 部署後找不到 `projects.json` | `vite.config.ts` 的 `base` 沒設定，或程式寫死 `/projects.json` |
| 部署後重新整理出現 404 | 沒使用 Hash 路由 |
| 網站在 App 內是空白 | 對方禁止內嵌，改設 `openMode: "newtab"` |
| 使用者看不到新版 | Service Worker 快取，重開 App 或點「更新」提示 |
| PowerShell 不能執行 npm | 執行 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |

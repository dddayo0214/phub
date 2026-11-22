# 部署與發佈

## 一、部署管理程式到 GitHub Pages

### 1. 設定 base

編輯 `vite.config.ts`，加入 `base`，值為你的 repo 名稱：

```ts
export default defineConfig({
  base: '/phub/',
  plugins: [react(), tailwindcss()],
})
```

### 3. 建立自動部署流程

建立 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx vitest run
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dists

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

這個流程會先跑測試，**測試失敗就不會部署**，避免把壞掉的邏輯放上線。Action 的版本號可能已更新，建議到各 Action 的頁面確認最新版。

### 4. 開啟 Pages

到 repo 的 **Settings → Pages**，在 **Source** 選擇 **GitHub Actions**。

推送之後，到 **Actions** 分頁查看執行狀況，成功後網址為：

```
https://<dddayo0214>.github.io/phub/
```

### 5. 部署後檢查

- [ ] 首頁能開，專案清單有顯示
- [ ] 重新整理任何頁面都不是 404
- [ ] 手機 Chrome 能看到安裝提示（需要 PWA 設定完成）
- [ ] 專案的 iframe 或新分頁開啟都正常

---

## 二、發佈 Android 專案的 APK

### 1. 簽署金鑰

Android 要求 APK 必須簽署，而且**更新版必須用同一把金鑰簽署**，否則使用者無法直接覆蓋安裝，只能先解除安裝再重裝。

- 用 Android Studio 或 `keytool` 產生金鑰（keystore）
- **永遠不要把 keystore 或密碼提交到 GitHub**，在 `.gitignore` 排除 `*.jks`、`*.keystore`
- 至少備份兩份，放在不同的安全位置，並另外記下密碼與別名
- 遺失金鑰就沒辦法發佈可覆蓋更新的新版本

### 2. 建立 Release

1. 在該專案的 repo，進入 **Releases → Draft a new release**
2. 建立標籤，例如 `v1.0.0`
3. 上傳已簽署的 APK，**檔名固定**，例如 `notes.apk`
4. 發佈（Publish）

### 3. 固定下載連結

```
https://github.com/<帳號>/<repo>/releases/latest/download/notes.apk
```

只要每次 Release 的檔名相同，這條連結永遠指向最新版，`projects.json` 不需要每次改連結。

注意：`latest` 指的是最新的**正式** Release，標記為 pre-release 或草稿的不算。

### 4. 計算校驗碼並更新清單

```powershell
Get-FileHash .\notes.apk -Algorithm SHA256
```

將結果填入 `projects.json` 的 `sha256`，同時更新 `version`、`sizeMB`、`updatedAt`。

### 5. 發佈前的檢查

- [ ] 在真實的 Android 手機上測試過安裝與開啟
- [ ] APK 內沒有寫死的 API Key、密碼、私人網址
- [ ] 使用了第三方素材或函式庫的，確認授權允許散布
- [ ] 版本號大於上一版（Android 要求，否則無法覆蓋安裝）
- [ ] `sha256` 是這一版的

---

## 三、授權條款

1. 在 repo 根目錄加入 `LICENSE` 檔（可在 GitHub 新增檔案時選擇 MIT 範本）
2. 沒有授權條款的公開程式碼，法律上別人不能使用或修改
3. phub 的授權與各專案的授權互相獨立，各專案在自己的 repo 標示即可

---

## 四、之後升級 Capacitor 版

屆時 phub 自己也會有 APK，同樣放在 GitHub Releases，流程與上面第二節相同，並可用 GitHub Actions 自動打包。簽署金鑰要與你其他專案分開管理。

升級前請先確認 Capacitor 與 Android Studio 的最新安裝指南，版本需求會隨時間變動。

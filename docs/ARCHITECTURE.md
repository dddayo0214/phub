# 架構與技術鏈

## 設計原則

1. **邏輯與畫面分離。** 所有業務邏輯（驗證、篩選、搜尋、平台判斷、下載連結處理）寫成不依賴 React 的純函式，並有單元測試。畫面只負責呈現。之後用 Figma 重新設計時，只替換 `components/`。
2. **沒有後端。** 整個專案是靜態網站，資料來自一份隨網站部署的 JSON。
3. **壞資料不拖垮整體。** 單筆資料錯誤只略過該筆，並回報原因。
4. **只信任 https。** 所有外部網址必須是 `https` 開頭。

## 技術鏈

| 層面 | 選擇 | 理由 |
|---|---|---|
| 框架 | React | 生態最大，之後可原封不動交給 Capacitor 打包 |
| 建置工具 | Vite | 啟動快、設定少 |
| 語言 | TypeScript | `projects.json` 欄位多，型別能提早發現錯誤 |
| 樣式 | Tailwind CSS v4 | 已安裝；介面之後由 Figma 設計取代，不影響邏輯 |
| 測試 | Vitest | 與 Vite 整合，適合測試純函式 |
| PWA | vite-plugin-pwa | 產生 manifest 與 Service Worker |
| QR Code | 待定（輕量套件） | 階段 6 決定 |
| 部署 | GitHub Pages | 免費、自動 HTTPS |
| APK 發佈 | GitHub Releases | 免費，支援固定的 latest 下載連結 |

## 資料夾結構

```
phub/
├── public/
│   ├── projects.json        ← 專案清單（開發者維護）
│   └── icons/               ← PWA 圖示（階段 7）
├── src/
│   ├── types/               ← 型別定義（Project 等）
│   ├── data/                ← 載入與驗證 projects.json
│   ├── logic/               ← 篩選、搜尋、平台判斷、下載連結（純函式）
│   ├── hooks/               ← 把邏輯接到 React 的橋梁
│   ├── components/          ← 畫面（之後由 Figma 設計替換）
│   ├── App.tsx
│   └── main.tsx
├── docs/                    ← 文件
├── vite.config.ts
└── package.json
```

規則：`types/`、`data/`、`logic/` 內的檔案**不可以 import React**，這樣才能獨立測試，也才能在換介面時完全不動。

## 資料流向

```
開發者修改 projects.json
        ↓ git push
GitHub Pages 自動建置並部署
        ↓
使用者打開 phub
        ↓
loadProjects()   讀取 projects.json
        ↓
validateProjects()   逐筆驗證，回傳 { projects, errors }
        ↓
logic/   依搜尋詞與標籤篩選
        ↓
components/   呈現畫面
        ↓
使用者點擊
   ├─ 網站類  → iframe 開啟，或新分頁
   └─ Android → 連到 GitHub Releases 的 APK 下載連結
```

## 重要的技術細節

### 路徑與 base

部署到 GitHub Pages 後，網站位於子路徑（例如 `/phub/`）。因此：

- `vite.config.ts` 需設定 `base: '/phub/'`（repo 名稱）
- 程式中讀取資料一律使用 `import.meta.env.BASE_URL`，不要寫死 `/projects.json`

### 路由

GitHub Pages 不支援單頁應用的路徑重寫，直接重新整理 `/phub/project/abc` 會得到 404。解法是使用 **Hash 路由**（網址形如 `/phub/#/project/abc`），或加上 404.html 轉址。第一版採用 Hash 路由，最單純。

### iframe 內嵌的限制

- 對方網站若設定 `X-Frame-Options` 或 CSP 的 `frame-ancestors`，會拒絕被內嵌，且瀏覽器不會給程式明確的失敗通知
- 因此不依賴「偵測失敗」，而是由 `openMode` 事先指定，並在 iframe 旁永遠提供「改用新分頁開啟」
- `http` 網址無法內嵌在 `https` 頁面中（混合內容），所以驗證階段就只接受 `https`

### APK 下載

- 使用一般的下載連結，交由瀏覽器與系統通知處理
- 不用 `fetch` 讀取 APK，因為 GitHub Releases 會轉址到其他網域，跨網域讀取通常被擋，也就無法做進度條
- 固定連結格式：`https://github.com/<帳號>/<repo>/releases/latest/download/<檔名>.apk`，只要檔名每次都相同，連結就永遠指向最新版

### 平台偵測

以 User Agent 與螢幕特徵判斷是否為手機。這是「盡力而為」的判斷，不當作安全機制；偵測錯誤時，使用者仍可手動查看專案詳情。

### 本機偏好儲存

收藏與深色模式存放於 `localStorage`，讀寫都要包 `try/catch`（隱私模式下可能失敗），並對損壞的內容有容錯處理。

## 測試策略

| 對象 | 測試方式 |
|---|---|
| `validateProjects` | 單元測試（已完成，7 項） |
| 篩選與搜尋 | 單元測試 |
| 平台判斷 | 單元測試，以不同 User Agent 字串驗證 |
| 下載連結與校驗碼顯示 | 單元測試 |
| 畫面 | 第一版手動驗證；介面重做後再視需要補 |

## 升級到 Capacitor 的準備

- 網頁程式碼不需修改，Capacitor 會把 `dist/` 包進 Android 專案
- 使用者在 Chrome 裡的 PWA 與 Capacitor 版 APK 儲存空間是分開的，收藏等本機偏好不會自動搬移
- 升級後才能做：App 內下載與進度、偵測已安裝並開啟
- 預計加入一層 `platform` 介面（例如 `openApp()`、`isInstalled()`），網頁版回傳「不支援」，Capacitor 版才有實作，這樣介面層不用判斷自己跑在哪裡

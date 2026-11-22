# phub

> 我的個人作品商店：安裝這一個 App，就能瀏覽、開啟、下載我做的所有網站與程式。

phub 是一個 PWA（可安裝的網頁 App）。專案清單由開發者維護在一份 `projects.json` 中，使用者只能瀏覽與使用，不需要帳號，也不需要任何後端伺服器。

## 它能做什麼

- 瀏覽作品清單，依標籤篩選、關鍵字搜尋
- 在 App 內直接開啟網站與 React 專案（不能內嵌的網站自動改開新分頁）
- 下載 Android 專案的 APK，並顯示版本、檔案大小與 SHA-256 校驗碼
- 偵測目前裝置：電腦上遇到「僅限手機」的專案時，顯示 QR Code 讓手機掃描
- 可安裝到手機與電腦桌面，更新自動生效

完整功能與範圍請見 [docs/FEATURES.md](docs/FEATURES.md)。

## 快速開始（開發者）

需要 [Node.js](https://nodejs.org)（LTS 版本）與 Git。

```bash
git clone https://github.com/dddayo0214/phub.git
cd phub
npm install
npm run dev
```

瀏覽器打開終端機顯示的網址（通常是 `http://localhost:5173`）。

常用指令：

| 指令 | 用途 |
|---|---|
| `npm run dev` | 啟動開發伺服器 |
| `npx vitest run` | 執行所有測試一次 |
| `npm run lint` | 檢查程式碼風格 |
| `npm run build` | 打包正式版本 |
| `npm run preview` | 預覽打包後的結果 |

## 文件索引

| 文件 | 內容 |
|---|---|
| [docs/FEATURES.md](docs/FEATURES.md) | 功能清單、第一版範圍、不做的事 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 技術鏈、資料夾結構、設計原則、資料流向 |
| [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md) | `projects.json` 每個欄位的規則與範例 |
| [docs/USAGE.md](docs/USAGE.md) | 使用者怎麼安裝與使用、開發者怎麼新增與更新專案 |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | 部署到 GitHub Pages、發佈 APK、簽署金鑰注意事項 |

## 技術鏈

React · Vite · TypeScript · Tailwind CSS · Vitest · vite-plugin-pwa · GitHub Pages / Releases

## 開發進度

| 階段 | 內容 | 狀態 |
|---|---|---|
| 1 | 環境與專案建立 | 完成 |
| 2 | Tailwind 安裝 | 完成 |
| 3 | 資料型別、`projects.json`、驗證與測試 | 完成 |
| 4 | 篩選、搜尋、標籤統計（純邏輯） | 待做 |
| 5 | 詳情頁、App 內開啟網站 | 待做 |
| 6 | APK 下載、平台判斷、QR Code | 待做 |
| 7 | PWA 設定 | 待做 |
| 8 | 部署到 GitHub Pages | 待做 |
| 9 | 授權、發佈 APK、收尾 | 待做 |

## 之後的規劃

- 使用 Figma 重新設計介面，只替換 `components/`，邏輯層不動
- 升級為 Capacitor 版 APK：App 內下載、偵測已安裝的 App 並開啟
- 視需求加入管理表單（產生 `projects.json`）

## 授權

管理程式本身採用 MIT License（請在 repo 根目錄加入 `LICENSE` 檔）。
各個專案的授權由各專案自行決定，與本程式無關。

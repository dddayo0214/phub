# projects.json 資料格式

檔案位置：`public/projects.json`。最外層必須是**陣列**，每個元素是一個專案。

## 欄位總覽

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `id` | 字串 | 是 | 唯一識別碼，小寫英數字，單字間用連字號，例如 `my-todo-app` |
| `name` | 字串 | 是 | 顯示名稱，不可為空 |
| `description` | 字串 | 是 | 簡短描述，可以是空字串 |
| `type` | 字串 | 是 | `website`、`react`、`android`、`other` |
| `platform` | 字串 | 是 | `mobile`、`desktop`、`both` |
| `status` | 字串 | 是 | `active`、`done`、`paused` |
| `tags` | 字串陣列 | 是 | 標籤，可以是空陣列 |
| `url` | 字串 | 條件 | `website`、`react` 類型必填，必須是 `https` 開頭 |
| `openMode` | 字串 | 否 | `iframe`（預設）或 `newtab` |
| `apkUrl` | 字串 | 條件 | `android` 類型必填，必須是 `https` 開頭 |
| `version` | 字串 | 否 | 版本號，例如 `1.2.0` |
| `sha256` | 字串 | 否 | APK 校驗碼，64 個十六進位字元 |
| `sizeMB` | 數字 | 否 | 檔案大小（MB），必須大於 0 |
| `updatedAt` | 字串 | 否 | 最後更新日期，格式 `YYYY-MM-DD` |

## 驗證規則

- 最外層不是陣列：整份清單視為無效
- 任一必填欄位缺漏或不合法：**只略過該筆**，其餘照常顯示
- `id` 重複：保留第一筆，其餘略過
- 所有網址只接受 `https`
- 以上錯誤都會被收集並顯示，方便你修正

## 各類型範例

### 網站

```json
{
  "id": "my-portfolio",
  "name": "個人作品集",
  "description": "我的個人網站",
  "type": "website",
  "platform": "both",
  "status": "active",
  "tags": ["網站", "作品集"],
  "url": "https://example.com/portfolio",
  "openMode": "iframe",
  "updatedAt": "2026-11-01"
}
```

### React 專案（禁止內嵌，改開新分頁）

```json
{
  "id": "todo-react",
  "name": "待辦清單",
  "description": "用 React 做的待辦事項工具",
  "type": "react",
  "platform": "both",
  "status": "done",
  "tags": ["React", "工具"],
  "url": "https://example.com/todo",
  "openMode": "newtab"
}
```

### Android App

```json
{
  "id": "notes-app",
  "name": "筆記 App",
  "description": "Android 筆記程式",
  "type": "android",
  "platform": "mobile",
  "status": "active",
  "tags": ["Android", "工具"],
  "apkUrl": "https://github.com/<帳號>/notes-app/releases/latest/download/notes.apk",
  "version": "1.0.0",
  "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "sizeMB": 12.5,
  "updatedAt": "2026-11-10"
}
```
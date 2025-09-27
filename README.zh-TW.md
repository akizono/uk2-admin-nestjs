<div align="center">
<img src="https://s2.loli.net/2025/09/27/rN84dp3uh1TWBlJ.png" style="width:150px"/>
    <h1>UK2 Admin Nest</h1>
</div>
<div align="center">
    <img src="https://img.shields.io/github/license/akizono/uk2-admin"/>
    <img src="https://badgen.net/github/stars/akizono/uk2-admin?icon=github"/>
    <img src="https://img.shields.io/github/forks/akizono/uk2-admin"/>
</div>

<div align='center'>

  [English](./README.md) | 中文
</div>

# 介紹

## 項目簡介

基於 `Nest.js` + `TypeScript` + `TypeORM` + `MySQL` 構建的現代化 Node.js 管理系統後端，為 UK2-admin（前端項目）提供 API 支持。

集成 Swagger 文件自動生成、操作日誌追蹤，並支持動態欄位多語言配置，開箱即用。

## 項目說明

該項目是 UK2-admin 的後端部分。

目前開發進度：

| 開發狀態 | 功能     | 說明                                                         |
| ------ | -------- | ------------------------------------------------------------ |
| ✅    | 用戶管理 | 用戶是系統操作者，該功能主要完成系統用戶配置                 |
| ✅    | 部門管理 | 配置系統組織機構（公司、部門、小組），樹結構展現支持數據權限 |
| ✅    | 字典管理 | 對系統中經常使用的一些較為固定的數據進行維護                 |
| ✅    | 操作日誌 | 系統正常操作日誌記錄和查詢，集成 Swagger 生成日誌內容        |
| ✅    | 菜單管理 | 配置系統菜單、操作權限、按鈕權限標識等，本地快取提供性能     |
| ✅    | 角色管理 | 角色菜單權限分配、設置角色按機構進行數據範圍權限劃分         |
| ✅    | 欄位國際化 | 任何一張資料表的欄位都可以進行國際化                           |
| ✅    | Swagger | 集成 Swagger 生成 API 文件                                     |
| ❌    | 代碼生成 | 根據資料庫表結構生成對應的增刪改查代碼，並生成前端頁面    |
| ❌    | Redis | 集成 Redis 快取數據                                     |
| ❌    | 通知公告 | 系統通知公告資訊發布維護                                     |
| ❌    | 站內信   | 系統內的消息通知，提供站內信模版、站內信消息                 |

# 快速啟動

> 在進行啟動項目前，請確保您的開發環境已經安裝了 [Node.js](../../dev/nodejs) 和 [MySQL](../../dev/mysql)
>
> 按以下步驟完成環境配置與專案啟動，確保開發環境快速就緒。

## 初始化 [MySQL](../../dev/mysql)

### 1. MySQL 服務啟動

本專案採用 MySQL 作為數據儲存解決方案，請確保已正確安裝並啟動 [MySQL](../../dev/mysql) 資料庫服務。

### 2. 開發資料庫創建

在 MySQL 中創建一個專用於開發環境的資料庫，命名為`uk2_admin_dev`（可根據實際需求自訂名稱）。

### 3. 資料庫初始化腳本執行

執行專案提供的資料庫初始化腳本，完成基礎數據結構的創建與基礎數據的導入

- **腳本路徑**: sql/uk2_admin_dev.sql

- **注意事項**: 該腳本支持在不同資料庫名稱環境下執行，無需與配置中的資料庫名稱嚴格一致

### 4. **資料庫連接配置**

修改根目錄下的開發環境設定檔 `env.dev`，配置正確的資料庫連接參數。
```shell
# 資料庫類型，不需要修改
DB_TYPE = 'mysql'

# 資料庫地址
DB_HOST = '127.0.0.1'

# 資料庫埠
DB_PORT = 3306

# 資料庫名稱
DB_NAME = 'uk2_admin_dev'

# 資料庫使用者名稱
DB_USERNAME = 'root'

# 資料庫密碼
DB_PASSWORD = '123456'
```
>1. 參數 DB_TYPE為固定值，無需修改
>
>2. 若在第2步中使用了非默認資料庫名稱，請確保 DB_NAME參數與實際創建的資料庫名稱完全一致
>
>3. 生產環境部署時，請務必修改預設的資料庫憑據，採用更安全的認證方式
>


## 啟動專案

### 複製專案

請至您欲安裝專案的目錄下，於終端機執行以下 Git 指令以取得專案原始碼：

```shell
git clone https://github.com/akizono/uk2-admin-nestjs.git
```

### 相依套件安裝
進入專案目錄後，推薦使用 pnpm 安裝相依套件（若未安裝 pnpm，亦可使用 npm 替代）

```shell[pnpm]
cd ./uk2-admin-nestjs
pnpm install
```

### 專案啟動

1. 使用 [VSCode](https://code.visualstudio.com/) 開啟專案根目錄 uk2-admin-nestjs

2. 透過內建終端機執行開發啟動指令：
```shell[pnpm]
pnpm start:dev
```

# 相關專案

- [UK2-admin](https://github.com/akizono/uk2-admin) UK2-Admin-Nest 配套 Web 專案

# 貢獻

如果您發現了任何問題或有改進建議，請創建一個[issue](uk2-admin-nestjs/issues/new)或提交一個PR。我們歡迎您的貢獻！

# 協議

[MIT](LICENSE)
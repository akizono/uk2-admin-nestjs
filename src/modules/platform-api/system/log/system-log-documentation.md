# 系統操作日誌功能說明文件

## 1. 設計原理

系統操作日誌功能基於 NestJS 的攔截器（Interceptor）機制實現，通過全局攔截器自動記錄所有 API 請求和響應，實現無侵入式的日誌記錄。主要設計原則包括：

- **無侵入性**：不需要修改現有業務代碼，通過全局攔截器自動記錄
- **可配置性**：可以通過裝飾器靈活配置是否記錄日誌以及記錄哪些資訊
- **統一管理**：所有日誌記錄邏輯集中在一處，便於維護
- **安全性**：自動過濾敏感資訊，如密碼、令牌等

## 2. 核心組件

系統操作日誌功能主要包含以下核心組件：

1. **LogEntity**：日誌實體類，定義了日誌表的結構
2. **LogInterceptor**：日誌攔截器，負責攔截請求和響應，記錄日誌
3. **Operation 裝飾器**：用於標記操作類型和操作名稱
4. **LogService**：提供日誌的增刪改查功能
5. **LogController**：提供日誌的 API 介面

## 3. 日誌表結構

日誌表（system_log）包含以下欄位：

| 欄位名 | 類型 | 是否必填 | 說明 |
|-------|------|---------|------|
| id | bigint | 是 | 主鍵ID |
| path | string | 否 | 介面路徑 |
| method | string | 否 | HTTP方法（GET、POST、PUT、DELETE等） |
| params | json | 否 | 請求參數 |
| body | json | 否 | 請求體數據 |
| query | json | 否 | 查詢參數 |
| statusCode | int | 否 | HTTP狀態碼 |
| responseTime | int | 否 | 反應時間（毫秒） |
| userId | bigint | 否 | 使用者ID |
| ip | string | 否 | 使用者IP位址 |
| userAgent | string | 否 | 使用者代理（瀏覽器資訊） |
| isSuccess | tinyint | 否 | 是否操作成功（0: 失敗, 1: 成功） |
| errorMessage | text | 否 | 錯誤資訊 |
| errorStack | string | 否 | 錯誤堆棧 |
| module | string | 否 | 業務模組名 |
| actionType | string | 否 | 操作類型（CREATE/READ/UPDATE/DELETE等） |
| operationName | string | 否 | 操作名稱 |
| resourceId | string | 否 | 資源ID |
| creator | string | 否 | 創辦人 |
| createTime | datetime | 否 | 創建時間 |
| updater | string | 否 | 更新人 |
| updateTime | datetime | 否 | 更新時間 |
| status | tinyint | 否 | 狀態 |
| isDeleted | tinyint | 否 | 是否已刪除 |
| remark | string | 否 | 備註 |

## 4. 使用說明

### 4.1 基本使用

系統操作日誌功能已全局配置，默認情況下會自動記錄所有API請求。開發者無需額外編寫程式碼即可使用基本的日誌記錄功能。

### 4.2 使用 @Operation 裝飾器標記操作

為了更精確地記錄操作類型和名稱，建議在控制器方法上使用 `@Operation` 裝飾器：

```typescript
import { Operation, OperationType } from '@/common/decorators/operation.decorator';

@Post('/create')
@HasPermission('system:user:create')
@Operation({
  type: OperationType.CREATE,
  name: '創建使用者',
  module: 'user',
})
@ApiOperation({ summary: '建立使用者' })
@ApiResponse({ type: CreateUserResDto })
@ResponseMessage('建立使用者成功')
create(@Body() createUserReqDto: CreateUserReqDto) {
  return this.userService.create(createUserReqDto);
}
```

#### @Operation 裝飾器參數說明

| 參數名 | 類型 | 是否必填 | 說明 | 可選值 |
|-------|------|---------|------|-------|
| type | OperationType | 是 | 操作類型 | CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, IMPORT, EXPORT, OTHER |
| name | string | 是 | 操作名稱 | 自訂，如「創建使用者」、「更新角色」等 |
| module | string | 否 | 模組名稱 | 自訂，如「user」、「role」等，不填寫時會自動從路徑中提取 |
| skipLog | boolean | 否 | 是否跳過日誌記錄 | true/false，預設為 false |

### 4.3 查詢日誌

系統提供了日誌查詢介面，可以透過以下方式查詢日誌：

```
GET /platform-api/system/log/page
```

#### 查詢參數

| 參數名 | 類型 | 是否必填 | 說明 | 範例 |
|-------|------|---------|------|------|
| currentPage | number | 否 | 當前頁碼 | 1 |
| pageSize | number | 否 | 每頁記錄數 | 10 |
| path | string | 否 | 介面路徑 | /platform-api/system/user/create |
| method | string | 否 | HTTP方法 | POST |
| userId | string | 否 | 使用者ID | 1 |
| ip | string | 否 | 使用者IP | 127.0.0.1 |
| isSuccess | number | 否 | 是否成功 | 1 |
| module | string | 否 | 業務模組名 | user |
| actionType | string | 否 | 操作類型 | CREATE |
| operationName | string | 否 | 操作名稱 | 創建使用者 |
| startTime | string | 否 | 開始時間 | 2023-01-01 00:00:00 |
| endTime | string | 否 | 結束時間 | 2023-12-31 23:59:59 |

### 4.4 日誌配置

系統操作日誌功能的配置主要在 `LogInterceptor` 中，如需修改配置，請修改 `src/common/interceptors/log.interceptor.ts` 文件。

主要配置項包括：

1. **敏感欄位過濾**：在 `filterSensitiveInfo` 方法中配置需要過濾的敏感欄位
2. **模組名稱提取**：在 `getModuleFromPath` 方法中配置如何從路徑中提取模組名稱
3. **操作類型推斷**：在 `guessActionType` 方法中配置如何根據 HTTP 方法推斷操作類型
4. **資源ID提取**：在 `getResourceIdFromRequest` 方法中配置如何從請求中提取資源ID

## 5. 最佳實踐

### 5.1 合理使用 @Operation 裝飾器

為了更精確地記錄操作資訊，建議在所有控制器方法上使用 `@Operation` 裝飾器，特別是涉及數據修改的操作。

```typescript
@Operation({
  type: OperationType.CREATE,
  name: '創建使用者',
  module: 'user',
})
```

### 5.2 避免記錄敏感資訊

系統已經配置了常見敏感欄位的過濾，如 `password`、`token` 等。如果有其他敏感欄位需要過濾，請在 `LogInterceptor` 的 `sensitiveFields` 中添加。

### 5.3 避免記錄大量數據

日誌記錄會消耗系統資源，特別是當請求體或響應體很大時。對於文件上傳等大數據量的操作，建議使用 `@Operation` 裝飾器的 `skipLog` 參數跳過日誌記錄：

```typescript
@Operation({
  type: OperationType.IMPORT,
  name: '導入使用者數據',
  module: 'user',
  skipLog: true, // 跳過日誌記錄
})
```

### 5.4 定期清理日誌

系統日誌會隨著時間的推移不斷增加，建議定期清理不再需要的日誌數據，以避免資料庫過大影響系統性能。

## 6. 常見問題

### 6.1 日誌記錄失敗

如果日誌記錄失敗，可能的原因包括：

1. **資料庫連接問題**：檢查資料庫連接是否正常
2. **日誌表結構變更**：檢查日誌表結構是否與實體類一致
3. **循環依賴**：檢查是否存在循環依賴問題

### 6.2 日誌記錄不完整

如果日誌記錄不完整，可能的原因包括：

1. **請求被提前攔截**：檢查是否有其他攔截器或守衛提前攔截了請求
2. **異常未被捕獲**：檢查是否有未被捕獲的異常導致日誌記錄中斷

### 6.3 日誌記錄性能問題

如果日誌記錄影響系統性能，可以考慮以下最佳化措施：

1. **非同步記錄**：將日誌記錄改為非同步方式
2. **選擇性記錄**：只記錄重要操作的日誌
3. **批次記錄**：將日誌批次寫入資料庫

## 7. 擴展功能

### 7.1 添加自訂操作類型

如需添加自訂操作類型，請修改 `src/common/decorators/operation.decorator.ts` 文件中的 `OperationType` 枚舉：

```typescript
export enum OperationType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  OTHER = 'OTHER',
  // 添加自訂操作類型
  CUSTOM_TYPE = 'CUSTOM_TYPE',
}
```

### 7.2 添加日誌導出功能

可以在 `LogController` 中添加日誌導出功能，支持將日誌導出為 Excel、CSV 等格式。

### 7.3 添加日誌分析功能

可以添加日誌分析功能，統計不同時間段、不同操作類型的日誌數量，生成報表和圖表。

## 8. 注意事項

1. **避免修改日誌記錄邏輯**：日誌記錄邏輯已經經過最佳化，避免隨意修改
2. **避免在日誌中記錄敏感資訊**：確保敏感資訊已被過濾
3. **避免記錄過多無用資訊**：只記錄必要的資訊，避免浪費儲存空間
4. **定期備份日誌數據**：重要的日誌數據應定期備份
5. **定期清理過期日誌**：過期的日誌應定期清理，以節省儲存空間

## 9. 更新日誌

- **2025-08-28**：初始版本

/**
 * Demo - 腳本編寫範例
 * @description 這個檔案作為腳本的編寫範例；可在專案根目錄中使用 `node ./script/test/demo.mjs` 執行該腳本
 */

import { executeScriptWithRecord } from '../common/script-executor.mjs'
import { EnvHelper } from '../common/env-helper.mjs'

// 定義要執行的腳本邏輯
async function script(dataSource) {
  // 腳本成功執行會列印'Hello, world!'
  console.log('Hello, world!')

  // 列印當前環境變數的名稱
  // 關於當前使用的環境變數，可在`../common/script-executor.mjs` 中進行修改
  console.log('\r\n' + 'process.env.NODE_ENV: ', process.env.NODE_ENV)

  // 使用 EnvHelper 類別來獲取環境變數的值
  console.log('\r\n' + 'EnvHelper.getString("DB_NAME"): ', EnvHelper.getString('DB_NAME'))
  console.log('EnvHelper.getNumber("DB_PORT"): ', EnvHelper.getNumber('DB_PORT'))
  console.log('EnvHelper.getNumber("MAX_FILE_SIZE"): ', EnvHelper.getNumber('MAX_FILE_SIZE'))

  // 讀取資料庫的案例程式碼（「刪除、編輯、新增」可自行參考該程式碼進行修改）
  const systemUserRepository = dataSource.getRepository('UserEntity')
  const users = await systemUserRepository.find({ take: 1 })
  console.log('\r\n' + '已讀取到的用戶(DEMO): ', users)

  return 'executed successfully'
}

// 可以透過定義記錄參數來自訂記錄的內容
// const recordParams = {
//   name: '自訂name', // 腳本名稱
//   environment: '自訂environment', // 環境變數
//   result: '自訂result', // 執行結果
//   error: null, // 錯誤資訊
//   exitCode: 0, // 狀態碼
//   startTime: null, // 開始時間
//   endTime: null, // 結束時間
//   duration: 0, // 執行時間
// }

// 執行腳本並自動記錄
executeScriptWithRecord(
  script,
  //  recordParams
)

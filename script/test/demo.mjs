/**
 * Demo - 腳本編寫範例
 * @description 這個檔案作為腳本的編寫範例；可在專案根目錄中使用 `node ./script/test/demo.mjs` 執行該腳本
 */

import { executeScriptWithRecord } from '../common/script-executor.mjs'

// 定義要執行的腳本邏輯
async function script(dataSource) {
  // 腳本成功執行會列印'Hello, world!'
  console.log('Hello, world!')

  // 列印環境變數
  // 關於環境變數，可在`../common/script-executor.mjs` 中進行修改
  console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

  // 讀取資料庫的案例程式碼（「刪除、編輯、新增」可自行參考該程式碼進行修改）
  const systemUserRepository = dataSource.getRepository('UserEntity')
  const users = await systemUserRepository.find({ take: 1 })
  console.log('已讀取到的用戶(DEMO): ', users)

  return 'demo.mjs executed successfully'
}

// 定義記錄參數
const recordParams = {
  name: 'demo.mjs',
  environment: process.env.NODE_ENV,
}

// 執行腳本並自動記錄
executeScriptWithRecord(script, recordParams)

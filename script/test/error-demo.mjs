// 這個文件會脫離nestjs的腳手架運行 直接使用 `node ./script/demo-error.mjs` 執行
// 用於測試錯誤處理和退出碼

import { executeScriptWithRecord } from '../common/script-executor.mjs'

// 定義會出錯的腳本邏輯
async function script() {
  console.log('開始執行會出錯的腳本...')

  // 故意拋出錯誤來測試錯誤處理
  throw new Error('這是一個測試錯誤，用於驗證錯誤處理機制')

  return '這行不會被執行'
}

// 定義記錄參數
const recordParams = {
  name: 'demo-error.js',
  path: '/script/demo-error.js',
  environment: 'testing',
  type: 'js',
}

// 執行腳本並自動記錄
executeScriptWithRecord(script, recordParams)

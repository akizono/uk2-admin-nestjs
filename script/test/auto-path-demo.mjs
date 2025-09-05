// 這個文件會脫離nestjs的腳手架運行 直接使用 `node ./script/test-auto-path.mjs` 執行
// 用於測試自動路徑檢測功能

import { executeScriptWithRecord } from '../common/script-executor.mjs'

// 定義要執行的腳本邏輯
async function script() {
  console.log('測試自動路徑檢測功能2')
  console.log('這個腳本應該會自動檢測到路徑為: /script/test-auto-path.mjs')

  return '自動路徑檢測測試成功'
}

// 定義記錄參數（不需要指定 path 和 type）
const recordParams = {
  name: 'test-auto-path.js',
  environment: 'testing',
}

// 執行腳本並自動記錄
executeScriptWithRecord(script, recordParams)

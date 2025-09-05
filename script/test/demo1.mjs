// 這個文件會脫離nestjs的腳手架運行 直接使用 `node ./script/demo1.mjs` 執行

import { executeScriptWithRecord } from '../common/script-executor.mjs'

// 定義要執行的腳本邏輯
async function script() {
  console.log('Hello, world!')

  return 'demo1.js executed successfully'
}

// 定義記錄參數
const recordParams = {
  name: 'demo1.js',
  environment: 'testing',
}

// 執行腳本並自動記錄
executeScriptWithRecord(script, recordParams)

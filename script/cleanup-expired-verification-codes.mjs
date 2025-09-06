/**
 * CleanupExpiredVerificationCodes - 清理過期驗證碼
 * @description 這個工具類用於清理過期驗證碼, 並重設資料表的id（從1開始）
 */

import { MoreThan } from 'typeorm'

import { executeScriptWithRecord } from './common/script-executor.mjs'
import { EnvHelper } from './common/env-helper.mjs'

// 定義要執行的腳本邏輯
async function script(dataSource) {
  console.log('Hello, world !')
  console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

  // 獲取驗證碼資料庫實體
  const verifyCodeRepository = dataSource.getRepository('VerifyCodeEntity')

  // 讀取所有未過期的驗證碼
  const verificationCodeExpireMs = EnvHelper.getNumber('VERIFICATION_CODE_EXPIRE_MS')
  const verifyCodeResponse = await verifyCodeRepository.find({
    where: {
      createTime: MoreThan(new Date(Date.now() - verificationCodeExpireMs)),
    },
  })
  const verifyCodeList = verifyCodeResponse.map(item => {
    delete item.id
    return item
  })
  console.log(`讀取到 ${verifyCodeResponse.length} 條未過期的驗證碼`)

  // 清空驗證碼資料庫
  await verifyCodeRepository.clear()
  console.log('已清空驗證碼資料庫')

  // 還原驗證碼資料庫
  await verifyCodeRepository.insert(verifyCodeList)
  console.log('已還原驗證碼資料庫')

  return 'cleanup-expired-verification-codes.mjs executed successfully'
}

// 定義記錄參數
const recordParams = {
  name: 'cleanup-expired-verification-codes.mjs',
  environment: process.env.NODE_ENV,
}

// 執行腳本並自動記錄
executeScriptWithRecord(script, recordParams)

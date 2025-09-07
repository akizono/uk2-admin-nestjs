/**
 * CleanupExpiredVerificationCodes - 清理過期驗證碼
 * @description 這個工具類用於清理過期驗證碼, 並重設資料表的id（從1開始）
 */

import { MoreThan } from 'typeorm'

import { executeScriptWithRecord } from './common/script-executor.mjs'
import { EnvHelper } from './common/env-helper.mjs'

// 定義要執行的腳本邏輯
async function script(dataSource) {
  // 獲取驗證碼資料庫實體
  const verifyCodeRepository = dataSource.getRepository('VerifyCodeEntity')

  // 讀取所有未過期的驗證碼
  const verificationCodeExpireSeconds = EnvHelper.getNumber('VERIFICATION_CODE_EXPIRE_SECONDS')
  const verifyCodeResponse = await verifyCodeRepository.find({
    where: {
      createTime: MoreThan(new Date(Date.now() - verificationCodeExpireSeconds * 1000)),
    },
  })
  const verifyCodeList = verifyCodeResponse.map(item => {
    delete item.id
    return item
  })
  console.log(`讀取到 ${verifyCodeList.length} 條未過期的驗證碼`)

  // 清空驗證碼資料庫
  await verifyCodeRepository.clear()
  console.log('已清空驗證碼資料庫')

  // 還原驗證碼資料庫
  await verifyCodeRepository.insert(verifyCodeList)
  console.log('已還原驗證碼資料庫')

  return 'executed successfully'
}

// 執行腳本並自動記錄
executeScriptWithRecord(script)

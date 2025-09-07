/**
 * CleanupTokenBlacklist - 清理 token 黑名單
 * @description 這個工具類用於清理 [TOKEN_BLACKLIST_RETENTION_SECONDS] 秒前的 token 黑名單, 並重設資料表的id（從1開始）
 */

import { MoreThan } from 'typeorm'

import { executeScriptWithRecord } from './common/script-executor.mjs'
import { EnvHelper } from './common/env-helper.mjs'

// 定義要執行的腳本邏輯
async function script(dataSource) {
  // 獲取黑名單列表資料庫實體
  const tokenBlacklistRepository = dataSource.getRepository('TokenBlacklistEntity')

  // 獲取黑名單列表中所有需要保留的 token
  const tokenBlacklistRetentionSeconds = EnvHelper.getNumber('TOKEN_BLACKLIST_RETENTION_SECONDS')
  const tokenBlacklistResponse = await tokenBlacklistRepository.find({
    where: {
      createTime: MoreThan(new Date(Date.now() - tokenBlacklistRetentionSeconds * 1000)),
    },
  })
  const tokenBlacklistList = tokenBlacklistResponse.map(item => {
    delete item.id
    return item
  })
  console.log(`讀取到 ${tokenBlacklistList.length} 條需要保留的 token 黑名單`)

  // 清空黑名單列表
  await tokenBlacklistRepository.clear()
  console.log('已清空黑名單列表')

  // 還原黑名單列表
  await tokenBlacklistRepository.insert(tokenBlacklistList)
  console.log('已還原黑名單列表')

  return 'executed successfully'
}

// 執行腳本並自動記錄
executeScriptWithRecord(script)

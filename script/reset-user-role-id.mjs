/**
 * ResetUserRoleId - 重設「使用者角色」資料表的ID
 * @description 這個工具類用於重設「使用者角色」資料表的ID（從1開始）
 */

import { executeScriptWithRecord } from './common/script-executor.mjs'

// 定義要執行的腳本邏輯
async function script(dataSource) {
  // 獲取「使用者角色」資料庫實體
  const userRoleRepository = dataSource.getRepository('UserRoleEntity')

  // 獲取 「使用者角色」 資料表中的所有資料
  const userRoleResponse = await userRoleRepository.find()
  const userRoleList = userRoleResponse.map(item => {
    delete item.id
    return item
  })
  console.log(`讀取到 ${userRoleList.length} 條「使用者角色」`)

  // 清空「使用者角色」資料庫
  await userRoleRepository.clear()
  console.log('已清空「使用者角色」資料庫')

  // 還原「角色選單」資料庫
  await userRoleRepository.insert(userRoleList)
  console.log('已還原「使用者角色」資料庫')

  return 'executed successfully'
}

// 執行腳本並自動記錄
executeScriptWithRecord(script)

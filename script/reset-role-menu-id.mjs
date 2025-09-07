/**
 * ResetRoleMenuId - 重設「角色選單」資料表的ID
 * @description 這個工具類用於重設「角色選單」資料表的ID（從1開始）
 */

import { executeScriptWithRecord } from './common/script-executor.mjs'

// 定義要執行的腳本邏輯
async function script(dataSource) {
  // 獲取「角色選單」資料庫實體
  const roleMenuRepository = dataSource.getRepository('RoleMenuEntity')

  // 獲取 「角色選單」 資料表中的所有資料
  const roleMenuResponse = await roleMenuRepository.find()
  const roleMenuList = roleMenuResponse.map(item => {
    delete item.id
    return item
  })
  console.log(`讀取到 ${roleMenuList.length} 條「角色選單」`)

  // 清空「角色選單」資料庫
  await roleMenuRepository.clear()
  console.log('已清空「角色選單」資料庫')

  // 還原「角色選單」資料庫
  await roleMenuRepository.insert(roleMenuList)
  console.log('已還原「角色選單」資料庫')

  return 'executed successfully'
}

// 執行腳本並自動記錄
executeScriptWithRecord(script)

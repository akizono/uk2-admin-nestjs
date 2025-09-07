/**
 * ScriptExecutor - 通用腳本執行器
 * @description 這個工具類用於執行腳本並自動記錄執行結果到資料庫
 */

import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import path from 'path'
import { readdir } from 'fs/promises'
import { fileURLToPath } from 'url'

/*
 * 關於環境變數，可在這裡進行修改
 * 操作方法： 對需要的一條環境變數解除註解，並註解其他條環境變數（環境變數不會同時生效）
 */
process.env.NODE_ENV = 'dev'
// process.env.NODE_ENV = 'prod'
// process.env.NODE_ENV = 'test'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
console.log('\r\n============ 環境變數 ===========')
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

// 自動載入所有實體
async function loadAllEntities() {
  const entities = []
  const modulesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../dist/modules')

  // 遞迴搜尋所有 .entity.js 檔案
  async function findEntityFiles(dir) {
    const files = await readdir(dir, { withFileTypes: true })

    for (const file of files) {
      const fullPath = path.join(dir, file.name)

      if (file.isDirectory()) {
        await findEntityFiles(fullPath)
      } else if (file.name.endsWith('.entity.js')) {
        try {
          // 動態載入實體 - 跨平台路徑處理
          let fileUrl
          if (process.platform === 'win32') {
            // Windows 需要 file:// 協議，且路徑需要轉換
            fileUrl = `file:///${fullPath.replace(/\\/g, '/')}`
          } else {
            // Unix-like 系統 (Mac, Linux) 直接使用 file:// 協議
            fileUrl = `file://${fullPath}`
          }
          const entityModule = await import(fileUrl)
          const entityClass = Object.values(entityModule).find(
            exp => exp && typeof exp === 'function' && exp.prototype && exp.prototype.constructor,
          )

          if (entityClass) {
            entities.push(entityClass)
            console.log(`已載入實體: ${file.name}`)
          }
        } catch (error) {
          console.warn(`載入實體失敗 ${file.name}:`, error.message)
        }
      }
    }
  }

  await findEntityFiles(modulesDir)
  return entities
}

/**
 * 腳本執行記錄的參數介面
 */
export class ScriptLogParams {
  constructor({
    name,
    environment = 'testing',
    result = '',
    error = null,
    exitCode = 0,
    startTime = null,
    endTime = null,
    duration = 0,
  }) {
    this.name = name
    this.path = this.getCurrentScriptPath()
    this.environment = environment
    this.type = 'mjs' // 固定為 mjs
    this.result = result
    this.error = error
    this.exitCode = exitCode
    this.startTime = startTime
    this.endTime = endTime
    this.duration = duration
  }

  /**
   * 獲取當前腳本的路徑
   */
  getCurrentScriptPath() {
    // 獲取調用棧資訊
    const stack = new Error().stack
    const stackLines = stack.split('\n')

    // 找到第一個不是 script-executor.mjs 的檔案
    for (let i = 0; i < stackLines.length; i++) {
      const line = stackLines[i]
      if (line.includes('.mjs') && !line.includes('script-executor.mjs')) {
        // 提取檔案路徑
        const match = line.match(/\((.+\.mjs)/)
        if (match) {
          const fullPath = match[1]
          // 轉換為相對路徑
          const projectRoot = process.cwd()
          const relativePath = path.relative(projectRoot, fullPath)
          return `/${relativePath.replace(/\\/g, '/')}` // 統一使用正斜槓
        }
      }
    }

    // 如果無法從調用棧獲取，嘗試從 process.argv 獲取
    if (process.argv[1]) {
      const fullPath = process.argv[1]
      const projectRoot = process.cwd()
      const relativePath = path.relative(projectRoot, fullPath)
      return `/${relativePath.replace(/\\/g, '/')}`
    }

    // 最後的備用方案
    return '/script/unknown.mjs'
  }
}

/**
 * 通用腳本執行器類
 */
export class ScriptExecutor {
  constructor() {
    this.dataSource = null
  }

  /**
   * 初始化資料庫連接
   */
  async initializeDatabase() {
    if (this.dataSource && this.dataSource.isInitialized) {
      return this.dataSource
    }

    // 自動載入所有實體
    console.log('\r\n============ 載入實體 ===========')
    const allEntities = await loadAllEntities()
    console.log(`總共載入了 ${allEntities.length} 個實體\r\n`)

    this.dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: allEntities,
      synchronize: false, // 一定是false！！！
      logging: false, // 關閉 SQL 日誌
    })

    await this.dataSource.initialize()
    return this.dataSource
  }

  /**
   * 關閉資料庫連接
   */
  async closeDatabase() {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy()
      console.log('TypeORM 資料庫連接已關閉')
    }
  }

  /**
   * 保存腳本執行記錄到資料庫
   */
  async saveScriptLog(params) {
    const repository = this.dataSource.getRepository('ScriptExecutionLogEntity')
    const scriptLog = repository.create()
    scriptLog.name = params.name
    scriptLog.path = params.path
    scriptLog.result = params.result
    scriptLog.error = params.error
    scriptLog.exitCode = params.exitCode
    scriptLog.startTime = params.startTime
    scriptLog.endTime = params.endTime
    scriptLog.duration = params.duration
    scriptLog.environment = params.environment
    scriptLog.type = params.type

    const savedLog = await repository.save(scriptLog)

    return savedLog
  }

  /**
   * 執行腳本並記錄結果
   * @param {Function} scriptFunction - 要執行的腳本函數
   * @param {ScriptLogParams} logParams - 記錄參數
   * @returns {Object} 執行結果和保存的紀錄
   */
  async executeScript(scriptFunction, logParams) {
    const startTime = new Date()
    let result = ''
    let error = null
    let exitCode = 0
    let savedLog = null

    try {
      // 初始化資料庫連接
      await this.initializeDatabase()

      // 執行腳本函數
      console.log('============ 執行腳本 ===========')
      const scriptResult = await scriptFunction(this.dataSource)
      result = scriptResult || '腳本執行成功'
      exitCode = 0 // 成功時退出碼為 0

      // 更新紀錄參數
      logParams.startTime = startTime
      logParams.endTime = new Date()
      logParams.duration = logParams.endTime.getTime() - startTime.getTime()
      logParams.result = result
      logParams.error = error
      logParams.exitCode = exitCode

      // 保存記錄到資料庫
      savedLog = await this.saveScriptLog(logParams)

      console.log('\r\n============ 保存的紀錄詳情 ===========')
      console.log({
        id: savedLog.id,
        name: savedLog.name,
        path: savedLog.path,
        result: savedLog.result,
        startTime: savedLog.startTime,
        endTime: savedLog.endTime,
        duration: savedLog.duration,
        environment: savedLog.environment,
        type: savedLog.type,
        exitCode: savedLog.exitCode,
      })

      console.log(`\r\n============ 執行結束 ===========\r\n`)

      return {
        success: true,
        result: scriptResult,
        log: savedLog,
        exitCode: exitCode,
      }
    } catch (err) {
      error = err.message
      exitCode = 1 // 失敗時退出碼為 1
      result = '腳本執行失敗'

      // 更新紀錄參數
      logParams.startTime = startTime
      logParams.endTime = new Date()
      logParams.duration = logParams.endTime.getTime() - startTime.getTime()
      logParams.result = result
      logParams.error = error
      logParams.exitCode = exitCode

      try {
        // 即使出錯也要保存記錄
        savedLog = await this.saveScriptLog(logParams)
        console.log('\r\n============ 錯誤記錄已保存 ===========')
        console.log({
          id: savedLog.id,
          name: savedLog.name,
          error: savedLog.error,
          exitCode: savedLog.exitCode,
          result: savedLog.result,
        })
        console.log(`=======================================\r\n`)
      } catch (saveError) {
        console.error('保存錯誤記錄時發生問題:', saveError.message)
        // 如果連保存記錄都失敗了，至少要在控制台輸出錯誤資訊
        console.error('原始錯誤資訊:', error)
        console.error('原始錯誤詳情:', err)
      }

      console.error('執行過程中發生錯誤:', error)
      console.error('錯誤詳情:', err)

      return {
        success: false,
        error: err,
        result: result,
        log: savedLog,
        exitCode: exitCode,
      }
    } finally {
      // 關閉資料庫連接
      await this.closeDatabase()
    }
  }
}

/**
 * 便捷函數：執行腳本並記錄
 * @param {Function} scriptFunction - 要執行的腳本函數
 * @param {Object} logParams - 記錄參數物件
 * @returns {void} 內部會處理所有邏輯並退出進程
 */
export async function executeScriptWithRecord(scriptFunction, logParams) {
  const executor = new ScriptExecutor()

  try {
    const result = await executor.executeScript(scriptFunction, new ScriptLogParams(logParams))

    if (result.success) {
      console.log('腳本執行成功，退出碼:', result.exitCode + '\r\n')
      process.exit(result.exitCode)
    } else {
      console.error('腳本執行失敗，退出碼:', result.exitCode + '\r\n')
      process.exit(result.exitCode)
    }
  } catch (error) {
    console.error('執行過程中發生未預期的錯誤:', error + '\r\n')
    process.exit(1)
  }
}

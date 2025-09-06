import { config } from 'dotenv'

/* 環境變數輔助類 */
export class EnvHelper {
  private static initialized = false

  private static initialize() {
    if (this.initialized) return

    const NODE_ENV = process.env.NODE_ENV

    // 依序嘗試載入環境變數，不需要檢查檔案是否存在
    config({ path: `.env.${NODE_ENV}` })
    config({ path: '.env' })

    this.initialized = true
  }

  // 獲取字串類型環境變數
  static getString(targetName: string): string | undefined {
    this.initialize()
    return process.env[targetName]
  }

  // 獲取數字類型環境變數
  static getNumber(targetName: string): number | undefined {
    this.initialize()
    const value = process.env[targetName]
    return value ? Number(eval(value.toString())) : undefined
  }

  // 獲取布爾類型環境變數
  static getBoolean(targetName: string): boolean | undefined {
    this.initialize()
    const value = process.env[targetName]
    if (value === undefined) return undefined
    return value === 'true'
  }
}

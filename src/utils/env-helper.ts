/* 環境變數輔助類 */
export class EnvHelper {
  // 獲取環境變數文件路徑
  static getEnvFilePath() {
    const envFilePath = ['.env']
    switch (process.env.NODE_ENV) {
      case 'dev':
        envFilePath.unshift('.env.dev')
        break
      case 'prod':
        envFilePath.unshift('.env.prod')
        break
      case 'test':
        envFilePath.unshift('.env.test')
        break
      default:
        envFilePath.unshift('.env.dev') // 預設使用開發環境配置
    }
    return envFilePath
  }

  // 獲取字串類型環境變數
  static getString(targetName: string): string | undefined {
    return process.env[targetName]
  }

  // 獲取數字類型環境變數
  static getNumber(targetName: string): number | undefined {
    const value = process.env[targetName]
    return value ? parseInt(value, 10) : undefined
  }

  // 獲取布爾類型環境變數
  static getBoolean(targetName: string): boolean | undefined {
    const value = process.env[targetName]
    if (value === undefined) return undefined
    return value === 'true'
  }
}

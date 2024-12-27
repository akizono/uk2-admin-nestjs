export function getEnvFilePath() {
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
      envFilePath.unshift('.env.dev') // 默認使用開發環境配置
  }
  return envFilePath
}

function getEnvVar(targetName: string) {
  return process.env[targetName]
}

export const configuration = () => ({
  // 基础相关
  server: {
    port: parseInt(getEnvVar('SERVER_PORT'), 10) || 3000,
  },
  // 数据库相关
  database: {
    type: getEnvVar('DB_TYPE'),
    host: getEnvVar('DB_HOST'),
    port: parseInt(getEnvVar('DB_PORT'), 10) || 3306,
    username: getEnvVar('DB_USERNAME'),
    password: getEnvVar('DB_PASSWORD'),
    name: getEnvVar('DB_NAME'),
  },
})

import { ValidationPipe, PayloadTooLargeException } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvHelper } from './utils/env-helper'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局異常過濾器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 加入全局攔截器來處理欄位值長度檢查
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use((req, res, next) => {
    const maxFieldLength = EnvHelper.getNumber('MAX_FIELD_LENGTH')

    // 檢查請求體
    if (req.body && typeof req.body === 'object') {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string' && req.body[key].length > maxFieldLength) {
          throw new PayloadTooLargeException(`請求體中 ${key} 欄位值超過最大長度限制 ${maxFieldLength} 字元`)
        }
      }
    }

    // 檢查查詢參數
    if (req.query && typeof req.query === 'object') {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string' && req.query[key].length > maxFieldLength) {
          throw new PayloadTooLargeException(`查詢參數中 ${key} 欄位值超過最大長度限制 ${maxFieldLength} 字元`)
        }
      }
    }

    // 檢查 URL 路徑段數
    const url = req.url.split('/').slice(1)
    if (url.length > 5) {
      throw new PayloadTooLargeException(`URL 路徑段數超過最大限制`)
    }

    // 檢查 URL 片段長度
    for (const segment of url) {
      if (segment && segment.length > maxFieldLength) {
        throw new PayloadTooLargeException(`URL 片段 "${segment}" 超過最大長度限制 ${maxFieldLength} 字元`)
      }
    }

    next()
  })

  // 跨源资源共享
  app.enableCors({
    origin: EnvHelper.getString('CORS_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: EnvHelper.getBoolean('CORS_CREDENTIALS'),
  })

  await app.listen(EnvHelper.getNumber('SERVER_PORT'))
}
bootstrap()

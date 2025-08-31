import { ValidationPipe, PayloadTooLargeException } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as express from 'express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { EnvHelper } from './utils/env-helper'
import { requestContext } from './utils/request-context'

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

    // 檢查 URL 每個片段的長度
    for (let i = 0; i < url.length; i++) {
      // 檢查是否為最後一個 URL 片段
      if (i === url.length - 1) {
        const urlParts = url[i].split('?') // 使用 '?' 作為分隔符號將 URL 片段分割為基本路徑和查詢參數
        if (urlParts.length > 0) {
          // 如果存在查詢參數部分
          if (urlParts[1]) {
            const queryParams = urlParts[1].split('&') // 使用 '&' 作為分隔符號分割查詢參數

            // 檢查每一個查詢參數的長度
            for (const param of queryParams) {
              if (param.length > maxFieldLength) {
                throw new PayloadTooLargeException(`查詢參數 "${param}" 超過最大長度限制 ${maxFieldLength} 字元`) // 拋出錯誤
              }
            }
          }
        }
      } else if (url[i] && url[i].length > maxFieldLength) {
        throw new PayloadTooLargeException(`URL 片段 "${url[i]}" 超過最大長度限制 ${maxFieldLength} 字元`) // 拋出錯誤
      }
    }

    next()
  })

  // 加入全局驗證管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 移除未定義在 DTO 中的屬性
      transform: true, // 自動轉換輸入資料型別
      forbidNonWhitelisted: true, // 當收到未定義的屬性時拋出錯誤
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // 跨源資源共享
  app.enableCors({
    origin: EnvHelper.getString('CORS_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: EnvHelper.getBoolean('CORS_CREDENTIALS'),
  })

  // 將上下文注入到請求中
  app.use((req: Request, res: Response, next) => {
    requestContext.run({ request: req }, () => {
      next()
    })
  })

  // Swagger 設定
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document)

  // 配置靜態檔案服務
  const fileServeAccessPath = EnvHelper.getString('FILE_SERVE_ACCESS_PATH') // 檔案服務訪問路徑
  const fileStoragePath = EnvHelper.getString('FILE_STORAGE_PATH') // 檔案儲存路徑
  app.use(fileServeAccessPath, express.static(fileStoragePath))

  await app.listen(EnvHelper.getNumber('SERVER_PORT'))
}
bootstrap()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvHelper } from './utils/env-helper'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局異常過濾器
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(EnvHelper.getNumber('SERVER_PORT'))
}
bootstrap()

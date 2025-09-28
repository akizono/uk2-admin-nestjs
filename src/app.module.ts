import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvHelper } from './utils/env-helper'
import { GlobalSubscriber } from './common/subscribers/global.subscriber'
import { LogInterceptor } from './common/interceptors/log.interceptor'
import { systemModules } from './modules/system.modules'
import { operationsModules } from './modules/operations.modules'
import { businessModules } from './modules/business.modules'

/** ---- Code generation location: import ---- */ // 請勿刪除此處註解

@Module({
  imports: [
    /* 全局環境變數 */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /* 資料庫連結 */
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: EnvHelper.getString('DB_TYPE') as 'mysql',
        host: EnvHelper.getString('DB_HOST'),
        port: EnvHelper.getNumber('DB_PORT'),
        database: EnvHelper.getString('DB_NAME'),
        username: EnvHelper.getString('DB_USERNAME'),
        password: EnvHelper.getString('DB_PASSWORD'),

        poolSize: EnvHelper.getNumber('DB_POOL_SIZE'),
        autoLoadEntities: false, // 關閉自動載入實體
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 明確指定實體路徑，排除 script 目錄
        connectorPackage: EnvHelper.getString('DB_CONNECTOR_PACKAGE') as 'mysql' | 'mysql2',
        synchronize: EnvHelper.getBoolean('DB_SYNCHRONIZE'),
      }),
    }),
    ...systemModules,
    ...operationsModules,
    ...businessModules,

    /** ---- Code generation location: module ---- */ // 請勿刪除此處註解
  ],

  controllers: [AppController],

  providers: [
    AppService,
    GlobalSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class AppModule {}

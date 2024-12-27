import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { EnvHelper } from './utils/env-helper'

import { SystemUserModule } from './modules/system.user/system.user.module'
import { SystemAuthModule } from './modules/system.auth/system.auth.module'

@Module({
  imports: [
    /* 全局環境變數 */
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
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
        autoLoadEntities: EnvHelper.getBoolean('DB_AUTO_LOAD_ENTITIES'),
        connectorPackage: EnvHelper.getString('DB_CONNECTOR_PACKAGE') as 'mysql' | 'mysql2',
        synchronize: EnvHelper.getBoolean('DB_SYNCHRONIZE'),
      }),
    }),
    SystemUserModule,
    SystemAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

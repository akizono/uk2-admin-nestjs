import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvHelper } from './utils/env-helper'
import { UserModule } from './modules/admin-api/system/user/user.module'
import { AuthModule } from './modules/admin-api/system/auth/auth.module'
import { TokenBlacklistModule } from './modules/admin-api/system/token-blacklist/token-blacklist.module'
import { RoleModule } from './modules/admin-api/system/role/role.module'
import { GlobalSubscriber } from './common/subscribers/global.subscriber'
import { UserRoleModule } from './modules/admin-api/system/user-role/user-role.module'
import { MenuModule } from './modules/admin-api/system/menu/menu.module'
import { DeptModule } from './modules/admin-api/system/dept/dept.module'
import { RoleMenuModule } from './modules/admin-api/system/role-menu/role-menu.module'
import { DictTypeModule } from './modules/admin-api/system/dict-type/dict-type.module'
import { DictDataModule } from './modules/admin-api/system/dict-data/dict-data.module'
import { MultilingualFieldsModule } from './modules/admin-api/system/multilingual-fields/multilingual-fields.module'
import { CodeGenerationModule } from './modules/operations/code-generation/code-generation.module'
import { VerifyCodeModule } from './modules/admin-api/system/verify-code/verify-code.module'
import { LogModule } from './modules/admin-api/system/log/log.module'
import { LogInterceptor } from './common/interceptors/log.interceptor'
import { FileModule } from './modules/admin-api/operations/file/file.module'

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
        autoLoadEntities: EnvHelper.getBoolean('DB_AUTO_LOAD_ENTITIES'),
        connectorPackage: EnvHelper.getString('DB_CONNECTOR_PACKAGE') as 'mysql' | 'mysql2',
        synchronize: EnvHelper.getBoolean('DB_SYNCHRONIZE'),
      }),
    }),
    LogModule, // LogModule 一定要在其他模組之前引入
    UserModule,
    AuthModule,
    TokenBlacklistModule,
    RoleModule,
    UserRoleModule,
    MenuModule,
    RoleMenuModule,
    DeptModule,
    DictTypeModule,
    DictDataModule,
    MultilingualFieldsModule,
    CodeGenerationModule,
    VerifyCodeModule,
    FileModule,

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

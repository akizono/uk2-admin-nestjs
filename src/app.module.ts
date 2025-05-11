import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvHelper } from './utils/env-helper'
import { UserModule } from './modules/system/user/user.module'
import { AuthModule } from './modules/system/auth/auth.module'
import { TokenBlacklistModule } from './modules/system/token-blacklist/token-blacklist.module'
import { RoleModule } from './modules/system/role/role.module'
import { GlobalSubscriber } from './common/subscribers/global.subscriber'
import { UserRoleModule } from './modules/system/user-role/user-role.module'
import { MenuModule } from './modules/system/menu/menu.module'
import { DeptModule } from './modules/system/dept/dept.module'
import { RoleMenuModule } from './modules/system/role-menu/role-menu.module'
import { DictTypeModule } from './modules/system/dict-type/dict-type.module'
import { DictDataModule } from './modules/system/dict-data/dict-data.module'
import { LanguageModule } from './modules/system/language/language.module'
import { MultilingualFieldsModule } from './modules/system/multilingual-fields/multilingual-fields.module'

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
    LanguageModule,
    MultilingualFieldsModule,
  ],

  controllers: [AppController],

  providers: [AppService, GlobalSubscriber],
})
export class AppModule {}

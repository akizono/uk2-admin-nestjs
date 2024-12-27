import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getEnvFilePath, configuration } from './utils/env'

import { SystemUserModule } from './modules/system.user/system.user.module'

@Module({
  imports: [
    /* 全局環境變數 */
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [configuration],
      isGlobal: true,
    }),
    /* 資料庫連結 */
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql' | 'postgres' | 'mariadb'>('database.type'),
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        poolSize: 10,
        autoLoadEntities: true,
        connectorPackage: 'mysql2',
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    SystemUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

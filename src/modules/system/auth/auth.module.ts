import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { EnvHelper } from '@/utils/env-helper'

import { AuthGuard } from './auth.guard'
import { UserModule } from '@/modules/system/user/user.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: EnvHelper.getString('JWT_SECRET'),
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD, // 注入守衛
      useClass: AuthGuard, // 使用守衛
    },
  ],
})
export class AuthModule {}

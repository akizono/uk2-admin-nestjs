import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { APP_GUARD } from '@nestjs/core'
import { EnvHelper } from '@/utils/env-helper'

import { UserModule } from '@/modules/system/user/user.module'
import { TokenBlacklistModule } from '@/modules/system/token-blacklist/token-blacklist.module'
import { AuthGuard } from './guards/auth.guard'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { HasPermissionGuard } from '@/modules/system/auth/guards/has-permission.guard'
import { RoleModule } from '@/modules/system/role/role.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: EnvHelper.getString('JWT_SECRET'),
      }),
    }),
    UserModule,
    TokenBlacklistModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD, // 注入守衛
      useClass: AuthGuard, // 使用守衛
    },
    {
      provide: APP_GUARD,
      useClass: HasPermissionGuard,
    },
  ],
})
export class AuthModule {}

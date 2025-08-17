import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthGuard } from './guards/auth.guard'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { EnvHelper } from '@/utils/env-helper'
import { UserModule } from '@/modules/admin-api/system/user/user.module'
import { UserEntity } from '@/modules/admin-api/system/user/entity/user.entity'
import { TokenBlacklistModule } from '@/modules/admin-api/system/token-blacklist/token-blacklist.module'
import { HasPermissionGuard } from '@/modules/admin-api/system/auth/guards/has-permission.guard'
import { RoleModule } from '@/modules/admin-api/system/role/role.module'
import { VerifyCodeModule } from '@/modules/admin-api/system/verify-code/verify-code.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: EnvHelper.getString('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    TokenBlacklistModule,
    RoleModule,
    VerifyCodeModule,
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

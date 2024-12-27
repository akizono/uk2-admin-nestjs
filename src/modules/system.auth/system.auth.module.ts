import { Module } from '@nestjs/common'
import { SystemAuthController } from './system.auth.controller'
import { SystemAuthService } from './system.auth.service'
import { APP_GUARD } from '@nestjs/core'
import { SystemAuthGuard } from './system.auth.guard'
import { SystemUserModule } from '@/modules/system.user/system.user.module'

@Module({
  imports: [SystemUserModule],
  controllers: [SystemAuthController],
  providers: [
    SystemAuthService,
    {
      provide: APP_GUARD, // 注入守衛
      useClass: SystemAuthGuard, // 使用守衛
    },
  ],
})
export class SystemAuthModule {}

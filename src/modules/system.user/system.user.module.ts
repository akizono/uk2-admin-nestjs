import { Module } from '@nestjs/common'
import { SystemUserController } from './system.user.controller'

import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemUserEntity } from './entity/system.user.entity'
import { SystemUserService } from './system.user.service'

@Module({
  imports: [TypeOrmModule.forFeature([SystemUserEntity])],
  controllers: [SystemUserController],
  providers: [SystemUserService],
  exports: [SystemUserService],
})
export class SystemUserModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from './entity/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'

import { UserRoleEntity } from '@/modules/system/user-role/entity/user-role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

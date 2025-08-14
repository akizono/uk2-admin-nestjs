import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MultilingualFieldsEntity } from '../multilingual-fields/entity/multilingual-fields.entity'

import { UserEntity } from './entity/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'

import { UserRoleEntity } from '@/modules/admin-api/system/user-role/entity/user-role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity, MultilingualFieldsEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

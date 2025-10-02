import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RoleMenuModule } from '../role-menu/role-menu.module'

import { RoleEntity } from './entity/role.entity'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), RoleMenuModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

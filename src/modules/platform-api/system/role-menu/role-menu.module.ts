import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RoleMenuController } from './role-menu.controller'
import { RoleMenuService } from './role-menu.service'
import { RoleMenuEntity } from './entity/role-menu.entity'

import { MenuEntity } from '@/modules/platform-api/system/menu/entity/menu.entity'
import { RoleEntity } from '@/modules/platform-api/system/role/entity/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleMenuEntity, MenuEntity, RoleEntity])],
  controllers: [RoleMenuController],
  providers: [RoleMenuService],
  exports: [RoleMenuService],
})
export class RoleMenuModule {}

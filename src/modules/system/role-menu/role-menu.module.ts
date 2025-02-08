import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RoleMenuController } from './role-menu.controller'
import { RoleMenuService } from './role-menu.service'
import { RoleMenuEntity } from './entity/role-menu.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleMenuEntity])],
  controllers: [RoleMenuController],
  providers: [RoleMenuService],
})
export class RoleMenuModule {}

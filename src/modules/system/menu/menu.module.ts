import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../user/user.module'
import { RoleMenuModule } from '../role-menu/role-menu.module'

import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'
import { MenuEntity } from './entity/menu.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity]), UserModule, RoleMenuModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}

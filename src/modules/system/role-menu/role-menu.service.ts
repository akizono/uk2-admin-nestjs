import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleMenuEntity } from './entity/role-menu.entity'
import { CreateRoleMenuReqDto } from './dto/role-menu.req.dto'

import { MenuEntity } from '@/modules/system/menu/entity/menu.entity'
import { RoleEntity } from '@/modules/system/role/entity/role.entity'
import { create } from '@/common/services/base.service'

@Injectable()
export class RoleMenuService {
  constructor(
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepository: Repository<RoleMenuEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleMenuReqDto: CreateRoleMenuReqDto) {
    await create({
      dto: createRoleMenuReqDto,
      repository: this.roleMenuRepository,
      repeatCondition: ['roleId', 'menuId'],
      modalName: '角色關聯菜單',
      foreignKeyChecks: [
        {
          field: 'roleId',
          repository: this.roleRepository,
          modalName: '角色',
        },
        {
          field: 'menuId',
          repository: this.menuRepository,
          modalName: '菜單',
        },
      ],
    })
  }
}

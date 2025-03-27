import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleMenuEntity } from './entity/role-menu.entity'
import { CreateRoleMenuReqDto } from './dto/role-menu.req.dto'

import { create } from '@/common/services/base.service'

@Injectable()
export class RoleMenuService {
  constructor(
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepository: Repository<RoleMenuEntity>,
  ) {}

  async create(createRoleMenuReqDto: CreateRoleMenuReqDto) {
    await create({
      dto: createRoleMenuReqDto,
      repository: this.roleMenuRepository,
      existenceCondition: ['roleId', 'menuId'],
      modalName: '角色關聯菜單',
    })
  }
}

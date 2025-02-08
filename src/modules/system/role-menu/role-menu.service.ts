import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateRoleMenuDto } from './dto/create-role-menu'
import { RoleMenuEntity } from './entity/role-menu.entity'

@Injectable()
export class RoleMenuService {
  constructor(
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepository: Repository<RoleMenuEntity>,
  ) {}

  async create(createRoleMenuDto: CreateRoleMenuDto) {
    await this.roleMenuRepository.save(createRoleMenuDto)
  }
}

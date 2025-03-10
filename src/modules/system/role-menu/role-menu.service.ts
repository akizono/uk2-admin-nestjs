import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleMenuEntity } from './entity/role-menu.entity'
import { CreateRoleMenuReqDto } from './dto/role-menu.req.dto'

@Injectable()
export class RoleMenuService {
  constructor(
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepository: Repository<RoleMenuEntity>,
  ) {}

  async create(createRoleMenuReqDto: CreateRoleMenuReqDto) {
    await this.roleMenuRepository.save(createRoleMenuReqDto)
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleEntity } from './entity/role.entity'
import { CreateRoleDto } from './dto/create-role.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  // 根據 code 查詢角色
  async findOneByCode(code: string) {
    const role = await this.roleRepository.findOne({ where: { code } })
    if (!role) throw new NotFoundException('角色不存在')
    return { role }
  }

  // 新增角色
  async create(createRoleDto: CreateRoleDto) {
    const existRole = await this.roleRepository.findOne({ where: { code: createRoleDto.code } })
    if (existRole) throw new ConflictException('角色已存在')

    const newRole = this.roleRepository.create(createRoleDto)
    await this.roleRepository.save(newRole)
  }
}

import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleEntity } from './entity/role.entity'
import { FindRoleDto } from './dto/find-role.dto'
import { CreateRoleDto } from './dto/create-role.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async find(findRoleDto: FindRoleDto) {
    const { pageSize = 10, currentPage = 1, ...remain } = findRoleDto

    const skip = (currentPage - 1) * pageSize
    const conditions = Object.keys(remain).length > 0 ? remain : undefined

    const [role, total] = await this.roleRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        status: true,
      },
      where: {
        isDeleted: 0,
        ...conditions,
      },
      skip,
      take: pageSize,
    })

    return {
      total,
      list: role,
    }
  }

  async create(createRoleDto: CreateRoleDto) {
    const existRole = await this.roleRepository.findOne({ where: { code: createRoleDto.code } })
    if (existRole) throw new ConflictException('角色已存在')

    const newRole = this.roleRepository.create(createRoleDto)
    await this.roleRepository.save(newRole)
  }
}

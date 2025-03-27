import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleEntity } from './entity/role.entity'
import { CreateRoleReqDto, FindRoleReqDto } from './dto/role.req.dto'

import { create } from '@/common/services/base.service'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleReqDto: CreateRoleReqDto) {
    await create({
      dto: createRoleReqDto,
      repository: this.roleRepository,
      existenceCondition: ['code'],
      modalName: '角色',
    })
  }

  async find(findRoleReqDto: FindRoleReqDto) {
    const { pageSize = 10, currentPage = 1, ...remain } = findRoleReqDto

    const conditions = Object.keys(remain).length > 0 ? remain : undefined
    const skip = pageSize === 0 ? undefined : (currentPage - 1) * pageSize
    const take = pageSize === 0 ? undefined : pageSize

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
      take,
    })

    return {
      total,
      list: role,
    }
  }

  // 查詢角色綁定的菜單權限標識
  async findRoleHasPermissions(roleCode: string) {
    const role = await this.roleRepository.findOne({
      where: { code: roleCode },
      relations: {
        roleMenus: {
          menu: true,
        },
      },
    })
    if (!role) return []
    return role.roleMenus?.map(roleMenu => roleMenu.menu.permission).filter(Boolean) || []
  }
}

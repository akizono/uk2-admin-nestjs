import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleEntity } from './entity/role.entity'
import { CreateRoleReqDto, FindRoleReqDto } from './dto/role.req.dto'
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleReqDto: CreateRoleReqDto) {
    const existRole = await this.roleRepository.findOne({ where: { code: createRoleReqDto.code } })
    if (existRole) throw new ConflictException('角色已存在')

    const newRole = this.roleRepository.create(createRoleReqDto)
    await this.roleRepository.save(newRole)
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

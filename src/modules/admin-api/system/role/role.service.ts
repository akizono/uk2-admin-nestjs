import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleEntity } from './entity/role.entity'
import { CreateRoleReqDto, FindRoleReqDto, UpdateRoleReqDto } from './dto/role.req.dto'

import { _delete, create, find, update } from '@/common/services/base.service'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleReqDto: CreateRoleReqDto) {
    const result = await create({
      dto: createRoleReqDto,
      repository: this.roleRepository,
      repeatCondition: ['code'],
      modalName: '角色',
    })

    return { id: result.id }
  }

  async find(findRoleReqDto: FindRoleReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findRoleReqDto,
      repository: this.roleRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
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

  // 更新角色
  async update(updateRoleReqDto: UpdateRoleReqDto) {
    await update({
      dto: updateRoleReqDto,
      repository: this.roleRepository,
      existenceCondition: ['id'],
      modalName: '角色',
    })
  }

  // 刪除角色
  async delete(id: string) {
    if (id === '1') throw new BadRequestException('禁止刪除「super_admin」')
    if (id === '11') throw new BadRequestException('禁止刪除「common」')

    await _delete({
      id,
      repository: this.roleRepository,
      modalName: '角色',
    })
  }

  // 封鎖角色
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.roleRepository,
      existenceCondition: ['id'],
      modalName: '角色',
    })
  }

  // 解封鎖角色
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.roleRepository,
      existenceCondition: ['id'],
      modalName: '角色',
    })
  }
}

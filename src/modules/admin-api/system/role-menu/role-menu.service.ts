import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RoleMenuEntity } from './entity/role-menu.entity'
import {
  BatchUpdateRoleMenuReqDto,
  CreateRoleMenuReqDto,
  FindRoleMenuReqDto,
  PhysicalDeleteRoleMenuReqDto,
} from './dto/role-menu.req.dto'

import { MenuEntity } from '@/modules/admin-api/system/menu/entity/menu.entity'
import { RoleEntity } from '@/modules/admin-api/system/role/entity/role.entity'
import { create, find } from '@/common/services/base.service'
import { EnvHelper } from '@/utils/env-helper'

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
      modalName: '角色關聯選單',
      foreignKeyChecks: [
        {
          field: 'roleId',
          repository: this.roleRepository,
          modalName: '角色',
        },
        {
          field: 'menuId',
          repository: this.menuRepository,
          modalName: '選單',
        },
      ],
    })
  }

  async find(findRoleMenuReqDto: FindRoleMenuReqDto) {
    const { list, total } = await find({
      dto: findRoleMenuReqDto,
      repository: this.roleMenuRepository,
      relations: ['menu'],
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 批次更新角色關聯選單(會替換所有舊的關聯)
  async batchUpdate(batchUpdateRoleMenuReqDto: BatchUpdateRoleMenuReqDto) {
    try {
      const { roleId, menuIds } = batchUpdateRoleMenuReqDto

      if (roleId === EnvHelper.getString('DB_CONSTANT_SUPER_ADMIN_ROLE_ID')) {
        throw new BadRequestException('「超級管理員」的權限禁止修改')
      }

      // 查詢角色狀態
      const role = await this.roleRepository.findOne({ where: { id: roleId } })
      if (!role || role.status === 0 || role.isDeleted === 1) {
        throw new BadRequestException('角色狀態異常')
      }

      // 1. 先刪除角色原有的選單（真實刪除 不是邏輯刪除）
      await this.roleMenuRepository.delete({
        roleId,
      })

      // 2. 再新增新的選單
      for (const menuId of menuIds) {
        await this.create({
          roleId,
          menuId,
        })
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // 物理刪除指定的數據
  async physicalDelete(physicalDeleteRoleMenuReqDto: PhysicalDeleteRoleMenuReqDto) {
    await this.roleMenuRepository.delete(physicalDeleteRoleMenuReqDto)
  }
}

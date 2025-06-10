import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserService } from '../user/user.service'
import { RoleMenuService } from '../role-menu/role-menu.service'

import { MenuEntity } from './entity/menu.entity'
import { CreateMenuReqDto, FindMenuReqDto, UpdateMenuReqDto } from './dto/menu.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    private readonly userService: UserService,
    private readonly roleMenuService: RoleMenuService,
  ) {}

  // 新增選單
  async create(createMenuReqDto: CreateMenuReqDto) {
    const result = await create({
      dto: createMenuReqDto,
      repository: this.menuRepository,
      modalName: '選單',
    })

    return { id: result.id }
  }

  // 查詢選單
  async find(findMenuReqDto: FindMenuReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findMenuReqDto,
      repository: this.menuRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 獲取使用者有權限的菜單
  async getUserMenus(userId: string) {
    // 1. 先獲取使用者資訊及其角色
    const userInfo = await this.userService.find({ id: userId }, false)
    if (!userInfo.list.length) return { total: 0, list: [] }

    const user = userInfo.list[0]
    if (!user.roleIds || !user.roleIds.length) return { total: 0, list: [] }

    // 2. 獲取所有菜單，設置分頁參數，pageSize為0表示不分頁
    const allMenus = await this.find({ pageSize: 0, currentPage: 1, status: 1 })
    if (!allMenus.list.length) return { total: 0, list: [] }

    // 3. 獲取使用者所有角色的菜單ID
    const userRoleIds = user.roleIds
    const userMenuIds = new Set<string>()

    // 直接使用角色ID獲取菜單
    for (const roleId of userRoleIds) {
      const roleMenus = await this.roleMenuService.find({
        roleId,
        pageSize: 0,
        currentPage: 1,
      })

      if (roleMenus.list && roleMenus.list.length) {
        roleMenus.list.forEach(roleMenu => {
          userMenuIds.add(roleMenu.menuId)
        })
      }
    }

    // 4. 過濾使用者有權限的菜單
    const filteredMenus = allMenus.list.filter(menu => userMenuIds.has(menu.id))

    return {
      total: filteredMenus.length,
      list: filteredMenus,
    }
  }

  // 更新選單
  async update(updateMenuReqDto: UpdateMenuReqDto) {
    await update({
      dto: updateMenuReqDto,
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })
  }

  // 刪除選單
  async delete(id: string) {
    await _delete({
      id,
      repository: this.menuRepository,
      modalName: '選單',
    })
  }

  // 封鎖選單
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })
  }

  // 解封鎖選單
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })
  }
}

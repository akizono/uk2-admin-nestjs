import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserService } from '../user/user.service'
import { RoleMenuService } from '../role-menu/role-menu.service'

import { MenuEntity } from './entity/menu.entity'
import { CreateMenuReqDto, FindMenuReqDto, UpdateMenuReqDto } from './dto/menu.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'
import { EnvHelper } from '@/utils/env-helper'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    private readonly userService: UserService,
    private readonly roleMenuService: RoleMenuService,
  ) {}

  // 預設為「超級管理員」綁定
  async menuBindSuperAdmin(menuId: string) {
    await this.roleMenuService.create({
      roleId: EnvHelper.getString('DB_CONSTANT_SUPER_ADMIN_ROLE_ID'),
      menuId,
    })
  }

  // 新增選單
  async create(createMenuReqDto: CreateMenuReqDto) {
    const result = await create({
      dto: createMenuReqDto,
      repository: this.menuRepository,
      modalName: '選單',
    })

    // 預設為「超級管理員」綁定
    await this.menuBindSuperAdmin(result.id)

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

  /** 獲取使用者有權限的選單 */
  async getUserMenus(userId: string) {
    // 1. 先獲取使用者資訊及其角色
    const userInfo = await this.userService.find({ id: userId }, false)
    if (!userInfo.list.length) return { total: 0, list: [] }

    const user = userInfo.list[0]
    if (!user.roleIds || !user.roleIds.length) return { total: 0, list: [] }

    // 2. 獲取所有選單，設置分頁參數，pageSize為0表示不分頁
    const allMenus = await this.find({ pageSize: 0, currentPage: 1, status: 1 })
    if (!allMenus.list.length) return { total: 0, list: [] }

    // 3. 獲取使用者所有角色的選單ID
    const userRoleIds = user.roleIds
    const userMenuIds = new Set<string>()

    // 直接使用角色ID獲取選單
    for (const roleId of userRoleIds) {
      const roleMenus = await this.roleMenuService.find({
        roleId,
        pageSize: 0,
        currentPage: 1,
        status: 1,
      })

      if (roleMenus.list && roleMenus.list.length) {
        roleMenus.list.forEach(roleMenu => {
          userMenuIds.add(roleMenu.menuId)
        })
      }
    }

    // 4. 過濾使用者有權限的選單
    // 如果選單的 permission 為 null 或空字串，則不進行權限校驗，直接加入
    const filteredMenus = allMenus.list.filter(menu => {
      // 如果 類型為0，則不需要校驗
      if (menu.type === 0) {
        return true
      }
      // 否則，檢查使用者是否有此選單的權限
      return userMenuIds.has(menu.id)
    })

    // 5. 進一步處理目錄（type=0）：如果目錄下沒有子項，則移除該目錄
    // 使用Map提高查詢效率
    const menuMap = new Map(filteredMenus.map(menu => [menu.id, menu]))

    // 找出所有作為父級的ID
    const parentIds = new Set(
      filteredMenus.filter(menu => menu.parentId && menuMap.has(menu.parentId)).map(menu => menu.parentId),
    )

    // 最終結果：保留非目錄項或有子項的目錄
    const finalMenus = filteredMenus.filter(menu => menu.type !== 0 || parentIds.has(menu.id))

    return {
      total: finalMenus.length,
      list: finalMenus,
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

    // 取消所有角色對該選單的關聯
    await this.roleMenuService.physicalDelete({ menuId: id })
  }

  // 封鎖選單
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })

    // 取消所有角色對該選單的關聯
    await this.roleMenuService.physicalDelete({ menuId: id })
  }

  // 解封鎖選單
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })

    // 預設為「超級管理員」綁定
    await this.menuBindSuperAdmin(id)
  }
}

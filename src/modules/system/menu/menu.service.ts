import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MenuEntity } from './entity/menu.entity'
import { CreateMenuReqDto, FindMenuReqDto, UpdateMenuReqDto } from './dto/menu.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  // 新增菜單
  async create(createMenuReqDto: CreateMenuReqDto) {
    const result = await create({
      dto: createMenuReqDto,
      repository: this.menuRepository,
      modalName: '菜單',
    })

    return { id: result.id }
  }

  // 查詢菜單
  async find(findMenuReqDto: FindMenuReqDto) {
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

  // 更新菜單
  async update(updateMenuReqDto: UpdateMenuReqDto) {
    await update({
      dto: updateMenuReqDto,
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '菜單',
    })
  }

  // 刪除菜單
  async delete(id: string) {
    await _delete({
      id,
      repository: this.menuRepository,
      modalName: '菜單',
    })
  }

  // 封鎖菜單
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '菜單',
    })
  }

  // 解封鎖菜單
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.menuRepository,
      existenceCondition: ['id'],
      modalName: '菜單',
    })
  }
}

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

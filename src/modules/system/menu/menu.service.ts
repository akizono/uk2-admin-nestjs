import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MenuEntity } from './entity/menu.entity'
import { CreateMenuReqDto } from './dto/menu.req.dto'

import { create } from '@/common/services/base.service'
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  // 新增菜單
  async create(createMenuReqDto: CreateMenuReqDto) {
    await create({
      dto: createMenuReqDto,
      repository: this.menuRepository,
      modalName: '菜單',
    })
  }

  // todo：實現查詢 和其他摩快的查詢 記得先寫dto
}

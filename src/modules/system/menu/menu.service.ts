import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MenuEntity } from './entity/menu.entity'
import { CreateMenuReqDto } from './dto/menu.req.dto'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  async create(createMenuReqDto: CreateMenuReqDto) {
    const newMenu = this.menuRepository.create(createMenuReqDto)
    await this.menuRepository.save(newMenu)
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MenuEntity } from './entity/menu.entity'
import { CreateMenuDto } from './dto/create-menu.dto'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const newMenu = this.menuRepository.create(createMenuDto)
    await this.menuRepository.save(newMenu)
  }
}

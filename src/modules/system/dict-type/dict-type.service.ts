import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DictTypeEntity } from './entity/dict-type.entity'
import { CreateDictTypeReqDto, FindDictTypeReqDto, UpdateDictTypeReqDto } from './dto/dict-type.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class DictTypeService {
  constructor(
    @InjectRepository(DictTypeEntity)
    private readonly dictTypeRepository: Repository<DictTypeEntity>,
  ) {}

  // 新增字典類型
  async create(createDictTypeReqDto: CreateDictTypeReqDto) {
    const result = await create({
      dto: createDictTypeReqDto,
      repository: this.dictTypeRepository,
      existenceCondition: ['type'],
      modalName: '字典類型',
    })

    return { id: result.id }
  }

  // 查詢字典類型
  async find(findDictTypeReqDto: FindDictTypeReqDto) {
    const { list, total } = await find({
      dto: findDictTypeReqDto,
      repository: this.dictTypeRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 更新字典類型
  async update(updateDictTypeReqDto: UpdateDictTypeReqDto) {
    await update({
      dto: updateDictTypeReqDto,
      repository: this.dictTypeRepository,
      existenceCondition: ['id'],
      modalName: '字典類型',
    })
  }

  // 刪除字典類型
  async delete(id: string) {
    await _delete({
      id,
      repository: this.dictTypeRepository,
      modalName: '字典類型',
    })
  }

  // 封鎖字典類型
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.dictTypeRepository,
      existenceCondition: ['id'],
      modalName: '字典類型',
    })
  }

  // 解封字典類型
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.dictTypeRepository,
      existenceCondition: ['id'],
      modalName: '字典類型',
    })
  }
}

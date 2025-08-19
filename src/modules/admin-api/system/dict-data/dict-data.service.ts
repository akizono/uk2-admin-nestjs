import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DictTypeService } from '../dict-type/dict-type.service'

import { DictDataEntity } from './entity/dict-data.entity'
import { CreateDictDataReqDto, FindDictDataReqDto, UpdateDictDataReqDto } from './dto/dict-data.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class DictDataService {
  constructor(
    @InjectRepository(DictDataEntity)
    private readonly dictDataRepository: Repository<DictDataEntity>,
    private readonly dictTypeService: DictTypeService,
  ) {}

  // 新增字典類型
  async create(createDictDataReqDto: CreateDictDataReqDto) {
    const result = await create({
      dto: createDictDataReqDto,
      repository: this.dictDataRepository,
      repeatCondition: ['dictType', 'value'],
      modalName: '字典數據',
    })

    return { id: result.id }
  }

  // 查詢字典數據
  async find(_findDictDataReqDto: FindDictDataReqDto) {
    const { dictTypeStatus, ...findDictDataReqDto } = _findDictDataReqDto

    // 查詢該字典類型的狀態
    if (dictTypeStatus) {
      const dictTypeResponse = await this.dictTypeService.find({
        pageSize: 0,
        type: findDictDataReqDto.dictType,
        status: dictTypeStatus,
      })

      // 如果該字典類型不存在，則返回空
      if (dictTypeResponse.total === 0) {
        return { total: 0, list: [] }
      }
    }

    const { list, total } = await find({
      dto: findDictDataReqDto,
      repository: this.dictDataRepository,
      where: {
        isDeleted: 0,
      },
    })

    return { total, list }
  }

  // 更新字典數據
  async update(updateDictDataReqDto: UpdateDictDataReqDto) {
    await update({
      dto: updateDictDataReqDto,
      repository: this.dictDataRepository,
      existenceCondition: ['id'],
      repeatCondition: ['dictType', 'value'],
      modalName: '字典數據',
    })
  }

  // 刪除字典數據
  async delete(id: string) {
    await _delete({
      id,
      repository: this.dictDataRepository,
      modalName: '字典數據',
    })
  }

  // 封鎖字典數據
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.dictDataRepository,
      existenceCondition: ['id'],
      modalName: '字典數據',
    })
  }

  // 解封字典數據
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.dictDataRepository,
      existenceCondition: ['id'],
      modalName: '字典數據',
    })
  }
}

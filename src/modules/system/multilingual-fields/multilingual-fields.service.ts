import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MultilingualFieldsEntity } from './entity/multilingual-fields.entity'
import {
  CreateMultilingualFieldsReqDto,
  FindMultilingualFieldsReqDto,
  UpdateMultilingualFieldsReqDto,
} from './dto/multilingual-fields.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class MultilingualFieldsService {
  constructor(
    @InjectRepository(MultilingualFieldsEntity)
    private readonly multilingualFieldsRepository: Repository<MultilingualFieldsEntity>,
  ) {}

  // 新增多語言欄位
  async create(createMultilingualFieldsReqDto: CreateMultilingualFieldsReqDto) {
    const result = await create({
      dto: createMultilingualFieldsReqDto,
      repository: this.multilingualFieldsRepository,
      modalName: '多語言欄位',
    })

    return { id: result.id }
  }

  // 批次新增
  async createBatch(createMultilingualFieldsReqDtoArr: CreateMultilingualFieldsReqDto[]) {
    for (const createMultilingualFieldsReqDto of createMultilingualFieldsReqDtoArr) {
      await create({
        dto: createMultilingualFieldsReqDto,
        repository: this.multilingualFieldsRepository,
        modalName: '多語言欄位',
      })
    }
  }

  // 查詢多語言欄位
  async find(findMultilingualFieldsReqDto: FindMultilingualFieldsReqDto) {
    const { list, total } = await find({
      dto: findMultilingualFieldsReqDto,
      repository: this.multilingualFieldsRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 更新多語言欄位
  async update(updateMultilingualFieldsReqDto: UpdateMultilingualFieldsReqDto) {
    await update({
      dto: updateMultilingualFieldsReqDto,
      repository: this.multilingualFieldsRepository,
      existenceCondition: ['id'],
      modalName: '多語言欄位',
    })
  }

  // 刪除多語言欄位
  async delete(id: string) {
    await _delete({
      id,
      repository: this.multilingualFieldsRepository,
      modalName: '多語言欄位',
    })
  }

  // 封鎖多語言欄位
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.multilingualFieldsRepository,
      existenceCondition: ['id'],
      modalName: '多語言欄位',
    })
  }

  // 解封鎖多語言欄位
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.multilingualFieldsRepository,
      existenceCondition: ['id'],
      modalName: '多語言欄位',
    })
  }
}

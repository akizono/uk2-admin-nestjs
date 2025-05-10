import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { LanguageEntity } from './entity/language.entity'
import { CreateLanguageReqDto, FindLanguageReqDto, UpdateLanguageReqDto } from './dto/language.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  // 新增語言
  async create(createLanguageReqDto: CreateLanguageReqDto) {
    const result = await create({
      dto: createLanguageReqDto,
      repository: this.languageRepository,
      modalName: '語言',
    })

    return { id: result.id }
  }

  // 查詢語言
  async find(findLanguageReqDto: FindLanguageReqDto) {
    const { list, total } = await find({
      dto: findLanguageReqDto,
      repository: this.languageRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 更新語言
  async update(updateLanguageReqDto: UpdateLanguageReqDto) {
    await update({
      dto: updateLanguageReqDto,
      repository: this.languageRepository,
      existenceCondition: ['id'],
      modalName: '語言',
    })
  }

  // 刪除語言
  async delete(id: string) {
    await _delete({
      id,
      repository: this.languageRepository,
      modalName: '語言',
    })
  }

  // 封鎖語言
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.languageRepository,
      existenceCondition: ['id'],
      modalName: '語言',
    })
  }

  // 解封語言
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.languageRepository,
      existenceCondition: ['id'],
      modalName: '語言',
    })
  }
}

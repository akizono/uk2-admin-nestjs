import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CodeGenerationEntity } from './entity/code-generation.entity'
import {
  CreateCodeGenerationReqDto,
  FindCodeGenerationReqDto,
  UpdateCodeGenerationReqDto,
} from './dto/code-generation.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class CodeGenerationService {
  constructor(
    @InjectRepository(CodeGenerationEntity)
    private readonly codeGenerationRepository: Repository<CodeGenerationEntity>,
  ) {}

  // 新增
  async create(createCodeGenerationReqDto: CreateCodeGenerationReqDto) {
    const result = await create({
      dto: createCodeGenerationReqDto,
      repository: this.codeGenerationRepository,
      modalName: '模組',
    })

    return { id: result.id }
  }

  // 查詢
  async find(findCodeGenerationReqDto: FindCodeGenerationReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findCodeGenerationReqDto,
      repository: this.codeGenerationRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 更新
  async update(updateCodeGenerationReqDto: UpdateCodeGenerationReqDto) {
    await update({
      dto: updateCodeGenerationReqDto,
      repository: this.codeGenerationRepository,
      existenceCondition: ['id'],
      repeatCondition: ['code'],
      modalName: '模組',
    })
  }

  // 刪除
  async delete(id: string) {
    await _delete({
      id,
      repository: this.codeGenerationRepository,
      modalName: '模組',
    })
  }

  // 封鎖
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.codeGenerationRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })
  }

  // 解封鎖
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.codeGenerationRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })
  }
}

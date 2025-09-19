import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { VerifyCodeEntity } from './entity/verify-code.entity'
import { CreateVerifyCodeReqDto, FindVerifyCodeReqDto } from './dto/verify-code.req.dto'

import { create, find, findOne } from '@/common/services/base.service'

@Injectable()
export class VerifyCodeService {
  constructor(
    @InjectRepository(VerifyCodeEntity)
    private readonly verifyCodeRepository: Repository<VerifyCodeEntity>,
  ) {}

  // 新增驗證碼
  async create(createVerifyCodeReqDto: CreateVerifyCodeReqDto) {
    await create({
      dto: createVerifyCodeReqDto,
      repository: this.verifyCodeRepository,
      modalName: '驗證碼',
    })
  }

  // 查詢驗證碼
  async find(findVerifyCodeReqDto: FindVerifyCodeReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findVerifyCodeReqDto,
      repository: this.verifyCodeRepository,
      where: {
        isDeleted: 0,
        status: 1,
      },
    })

    return {
      total,
      list,
    }
  }

  // 查詢單一驗證碼
  async findOne(id: string) {
    return await findOne({ id, repository: this.verifyCodeRepository })
  }

  // 刪除某使用者的所有驗證碼
  async deleteUserAllVerifyCodes(userId: string) {
    await this.verifyCodeRepository.update({ userId }, { isDeleted: 1 })
  }
}

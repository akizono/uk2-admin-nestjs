import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as svgCaptcha from 'svg-captcha'

import { VerifyCodeEntity } from './entity/verify-code.entity'
import { CreateVerifyCodeReqDto, FindVerifyCodeReqDto } from './dto/verify-code.req.dto'

import { _delete, create, find, findOne } from '@/common/services/base.service'

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

  // 創建一個圖形驗證碼並返回
  async createImage() {
    // 生成圖形驗證碼
    const captcha = svgCaptcha.create({
      size: 4, // 驗證碼長度
      ignoreChars: '0o1il', // 忽略容易混淆的字符
      noise: 3, // 噪點數量
      color: true, // 彩色
      // background: '#f0f0f0', // 背景色
      // fontSize: 50, // 字體大小
      width: 120, // 寬度
      height: 40, // 高度
    })

    return {
      svg: captcha.data, // SVG 字串
      text: captcha.text, // 驗證碼文字（用於測試，正式環境應該移除）
    }
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

  // 刪除某個圖形驗證碼
  async delete(id: string) {
    await _delete({
      id,
      repository: this.verifyCodeRepository,
      modalName: '驗證碼',
    })
  }

  // 刪除某使用者的所有驗證碼
  async deleteUserAllVerifyCodes(userId: string) {
    await this.verifyCodeRepository.update({ userId }, { isDeleted: 1 })
  }
}

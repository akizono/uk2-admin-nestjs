import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TokenBlacklistEntity } from './entity/token-blacklist.entity'

import { Payload } from '@/modules/admin-api/system/auth/types'
import { create } from '@/common/services/base.service'

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(TokenBlacklistEntity)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklistEntity>,
  ) {}

  // 將 token 加入黑名單
  async create(payload: Payload) {
    await create({
      dto: {
        jwtId: payload.jti,
        userId: payload.sub,
        type: payload.type,
        expiredAt: new Date(payload.exp * 1000),
        issuedAt: new Date(payload.iat * 1000),
      },
      repository: this.tokenBlacklistRepository,
      modalName: 'Token 黑名單',
    })
  }

  // 根據 jwtId 查詢 token 是否在黑名單中
  async findByJwtId(jwtId: string) {
    return await this.tokenBlacklistRepository.findOne({ where: { jwtId } })
  }
}

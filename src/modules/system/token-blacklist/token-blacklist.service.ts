import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TokenBlacklistEntity } from './entity/token-blacklist.entity'
import { Payload } from '@/modules/system/auth/types'

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(TokenBlacklistEntity)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklistEntity>,
  ) {}

  // 將 token 加入黑名單
  async create(payload: Payload) {
    const { sub, jti, type, exp, iat } = payload
    const newTokenBlacklist = this.tokenBlacklistRepository.create({
      jwtId: jti,
      userId: sub,
      type: type,
      expiredAt: new Date(exp * 1000),
      issuedAt: new Date(iat * 1000),
    })
    await this.tokenBlacklistRepository.save(newTokenBlacklist)
  }

  // 根據 jwtId 查詢 token 是否在黑名單中
  async findByJwtId(jwtId: string) {
    return await this.tokenBlacklistRepository.findOne({ where: { jwtId } })
  }
}

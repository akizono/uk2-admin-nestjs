import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { v4 as uuidv4 } from 'uuid'
import { encryptPassword } from '@/utils/crypto'
import { EnvHelper } from '@/utils/env-helper'

import { LoginDto } from './dto/login.dto'
import { JwtRequest, UserWithPassword, Payload } from './types'
import { UserService } from '@/modules/system/user/user.service'
import { TokenBlacklistService } from '@/modules/system/token-blacklist/token-blacklist.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async validateUser(username: string, inputPassword: string): Promise<UserWithPassword | null> {
    const { userInfo } = await this.userService.findOneByUsername(username, true)
    const { hashedPassword } = encryptPassword(inputPassword, userInfo.salt)
    if (userInfo.password === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...userInfoFilter } = userInfo
      return userInfoFilter
    } else {
      return null
    }
  }

  async generateToken(userId: string, type: 'access' | 'refresh') {
    const payload = {
      sub: userId,
      type,
      jti: uuidv4(),
    }

    // 設定 Token 過期時間
    let expiresIn: number
    if (type === 'access') expiresIn = eval(EnvHelper.getString('JWT_ACCESS_TOKEN_EXPIRES_IN'))
    if (type === 'refresh') expiresIn = eval(EnvHelper.getString('JWT_REFRESH_TOKEN_EXPIRES_IN'))

    // 返回Token
    return await this.jwtService.signAsync(payload, { expiresIn })
  }

  // 登入
  async login(loginDto: LoginDto) {
    const userInfo = await this.validateUser(loginDto.username, loginDto.password)
    if (!userInfo) throw new UnauthorizedException('密碼錯誤')

    return {
      userInfo,
      token: {
        accessToken: await this.generateToken(userInfo.id, 'access'),
        refreshToken: await this.generateToken(userInfo.id, 'refresh'),
      },
    }
  }

  // 刷新 Token
  async refreshTokenMethod(request: JwtRequest) {
    const { accessPayload, refreshPayload, accessToken, refreshToken } = request

    // 如果過期則更新 Token 否則返回原 Token
    const renewTokenIfExpiringSoon = async (payload: Payload, token: string) => {
      // 計算當前時間到過期時間的剩餘秒數
      const timeUntilExpiry = payload.exp - Math.floor(Date.now() / 1000)

      // 如果剩餘時間小於 1800秒
      if (timeUntilExpiry < 1800) {
        if (timeUntilExpiry > 0) await this.tokenBlacklistService.create(payload) // 將未過期的 Token 加入黑名單
        return await this.generateToken(payload.sub, payload.type) // 返回新的 Token
      }
      return token
    }

    return {
      accessToken: await renewTokenIfExpiringSoon(accessPayload, accessToken),
      refreshToken: await renewTokenIfExpiringSoon(refreshPayload, refreshToken),
    }
  }
}

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'

import { JwtRequest, AuthenticatedUser, Payload } from './types'
import { LoginReqDto } from './dto/auth.req.dto'

import { encryptPassword } from '@/utils/crypto'
import { EnvHelper } from '@/utils/env-helper'
import { UserService } from '@/modules/system/user/user.service'
import { TokenBlacklistService } from '@/modules/system/token-blacklist/token-blacklist.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async validateUser(username: string, inputPassword: string): Promise<AuthenticatedUser | null> {
    const { list } = await this.userService.find({ username }, true)
    if (list.length === 0) throw new NotFoundException('使用者名稱或密碼錯誤')

    const { userInfo, role } = list[0]
    const { hashedPassword } = encryptPassword(inputPassword, userInfo.salt)
    if (userInfo.password === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...userInfoFilter } = userInfo
      return {
        userInfo: userInfoFilter,
        role,
      }
    } else {
      return null
    }
  }

  async generateToken(userId: string, role: string[], type: 'access' | 'refresh') {
    const payload = {
      sub: userId,
      role,
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

  /** 登入 */
  async login(loginReqDto: LoginReqDto) {
    const { userInfo, role } = await this.validateUser(loginReqDto.username, loginReqDto.password)
    if (!userInfo) throw new UnauthorizedException('密碼錯誤')

    return {
      userInfo,
      role,
      token: {
        accessToken: await this.generateToken(userInfo.id, role, 'access'),
        refreshToken: await this.generateToken(userInfo.id, role, 'refresh'),
      },
    }
  }

  /** 刷新 Token */
  async refreshTokenMethod(request: JwtRequest) {
    const { accessPayload, refreshPayload, accessToken, refreshToken } = request

    // 如果過期則更新 Token 否則返回原 Token
    const renewTokenIfExpiringSoon = async (payload: Payload, token: string) => {
      // 計算當前時間到過期時間的剩餘秒數
      const timeUntilExpiry = payload.exp - Math.floor(Date.now() / 1000)

      // 如果剩餘時間小於 1800秒
      if (timeUntilExpiry < 1800) {
        if (timeUntilExpiry > 0) await this.tokenBlacklistService.create(payload) // 將未過期的 Token 加入黑名單
        return await this.generateToken(payload.sub, payload.role, payload.type) // 返回新的 Token
      }
      return token
    }

    return {
      accessToken: await renewTokenIfExpiringSoon(accessPayload, accessToken),
      refreshToken: await renewTokenIfExpiringSoon(refreshPayload, refreshToken),
    }
  }
}

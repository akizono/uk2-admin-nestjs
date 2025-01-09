import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { encryptPassword } from '@/utils/crypto'
import { JwtService } from '@nestjs/jwt'
import { EnvHelper } from '@/utils/env-helper'
import { v4 as uuidv4 } from 'uuid'
import { UserEntity } from '../user/entity/user.entity'

type UserWithPassword = Partial<Pick<UserEntity, 'password' | 'salt'>> & Omit<UserEntity, 'password' | 'salt'>

interface Payload {
  sub: string
  type: 'access' | 'refresh'
  jti: string
  iat: number
  exp: number
}

export interface JwtRequest extends Request {
  accessPayload?: Payload
  refreshPayload?: Payload
  accessToken?: string
  refreshToken?: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

    let expiresIn: string | number
    if (type === 'access') expiresIn = eval(EnvHelper.getString('JWT_ACCESS_TOKEN_EXPIRES_IN'))
    if (type === 'refresh') expiresIn = eval(EnvHelper.getString('JWT_REFRESH_TOKEN_EXPIRES_IN'))

    return this.jwtService.signAsync(payload, { expiresIn })
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

    // 檢查 Token 的剩餘有效期，如果小於 30 分鐘則重新生成，否則保持原有 Token
    const generateIfExpired = async (payload: Payload, token: string) => {
      return payload.iat + 30 * 60 < Date.now() / 1000 ? await this.generateToken(payload.sub, payload.type) : token
    }

    return {
      accessToken: await generateIfExpired(accessPayload, accessToken),
      refreshToken: await generateIfExpired(refreshPayload, refreshToken),
    }
  }
}

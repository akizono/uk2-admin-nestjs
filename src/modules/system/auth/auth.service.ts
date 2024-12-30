import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { encryptPassword } from '@/utils/crypto'
import { JwtService } from '@nestjs/jwt'
import { EnvHelper } from '@/utils/env-helper'
import { v4 as uuidv4 } from 'uuid'
import { UserEntity } from '../user/entity/user.entity'

type UserWithPassword = Partial<Pick<UserEntity, 'password' | 'salt'>> & Omit<UserEntity, 'password' | 'salt'>

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserWithPassword | null> {
    const { user } = await this.userService.findOneByUsername(username, true)
    const { hashedPassword } = encryptPassword(password, user.salt)
    if (user.password === hashedPassword) {
      return user
    } else {
      return null
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token)
    } catch {
      return null
    }
  }

  async generateToken(userId: number, type: 'access' | 'refresh') {
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
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) throw new UnauthorizedException('密碼錯誤')

    return {
      user,
      token: {
        accessToken: await this.generateToken(user.id, 'access'),
        refreshToken: await this.generateToken(user.id, 'refresh'),
      },
    }
  }

  // 刷新 Token
  async refreshToken(accessToken: string, refreshToken: string) {
    // 驗證 token 的有效性
    const accessPayload = await this.validateToken(accessToken)
    const refreshPayload = await this.validateToken(refreshToken)

    if (!accessPayload || accessPayload.type !== 'access') throw new UnauthorizedException('權限校驗未通過')
    if (!refreshPayload || refreshPayload.type !== 'refresh') throw new UnauthorizedException('權限校驗未通過')

    if (accessPayload.sub !== refreshPayload.sub) throw new UnauthorizedException('權限校驗未通過')

    // 如果 accessToken 的有效期不足30分鐘，則生成新的 accessToken，否則返回原 accessToken。
    const generateIfExpired = async (payload: any, token: string) => {
      return payload.iat + 30 * 60 < Date.now() / 1000 ? await this.generateToken(payload.sub, payload.type) : token
    }

    return {
      accessToken: await generateIfExpired(accessPayload, accessToken),
      refreshToken: await generateIfExpired(refreshPayload, refreshToken),
    }
  }
}

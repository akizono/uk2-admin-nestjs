import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SystemUserService } from '@/modules/system.user/system.user.service'
import { LoginDto } from './dto/login.dto'
import { encryptPassword } from '@/utils/crypto'
import { JwtService } from '@nestjs/jwt'
import { EnvHelper } from '@/utils/env-helper'
import { v4 as uuidv4 } from 'uuid'
import { SystemUserEntity } from '../system.user/entity/system.user.entity'

type UserWithPassword = Partial<Pick<SystemUserEntity, 'password' | 'salt'>> &
  Omit<SystemUserEntity, 'password' | 'salt'>

@Injectable()
export class SystemAuthService {
  constructor(
    private readonly systemUserService: SystemUserService,
    private readonly jwtService: JwtService,
  ) {}

  // 驗證密碼
  async validateUser(username: string, password: string): Promise<UserWithPassword | null> {
    const user = await this.systemUserService.findOneByUsername(username, true)
    const { hashedPassword } = encryptPassword(password, user.salt)
    if (user.password === hashedPassword) {
      return user
    } else {
      return null
    }
  }

  // 產生 token
  async generateToken(user: UserWithPassword, type: 'access' | 'refresh') {
    const payload = {
      sub: user.id,
      username: user.username,
      type,
      jti: uuidv4(),
      iat: Math.floor(Date.now() / 1000),
    }

    let expiresIn: string | number
    if (type === 'access') expiresIn = eval(EnvHelper.getString('JWT_ACCESS_TOKEN_EXPIRES_IN'))
    if (type === 'refresh') expiresIn = eval(EnvHelper.getString('JWT_REFRESH_TOKEN_EXPIRES_IN'))

    return this.jwtService.signAsync(payload, { expiresIn })
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) throw new UnauthorizedException('密碼錯誤')

    return {
      user,
      token: {
        accessToken: await this.generateToken(user, 'access'),
        refreshToken: await this.generateToken(user, 'refresh'),
      },
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SystemUserService } from '@/modules/system.user/system.user.service'
import { LoginDto } from './dto/login.dto'
import { encryptPassword } from '@/utils/crypto'

@Injectable()
export class SystemAuthService {
  constructor(private readonly systemUserService: SystemUserService) {}

  async validateUser(username: string, password: string) {
    const user = await this.systemUserService.findOneByUsername(username, true)
    const { hashedPassword } = encryptPassword(password, user.salt)
    if (user.password === hashedPassword) {
      return user
    } else {
      return null
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) throw new UnauthorizedException('密碼錯誤')

    return { ...user }
  }
}

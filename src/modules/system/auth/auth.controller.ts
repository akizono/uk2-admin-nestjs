import { Body, Controller, Post, UseInterceptors, Headers } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public, ResponseMessage } from '@/common/decorators/'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

@Controller('/auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ResponseMessage('登入成功')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @Post('/refresh')
  @ResponseMessage('刷新成功')
  async refreshToken(@Headers() headers: Record<string, string>) {
    const accessToken = headers['authorization']?.replace('Bearer ', '')
    const refreshToken = headers['refresh-token']?.replace('Bearer ', '')

    return await this.authService.refreshToken(accessToken, refreshToken)
  }
}

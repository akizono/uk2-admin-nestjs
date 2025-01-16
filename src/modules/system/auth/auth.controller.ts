import { Body, Controller, Post, UseInterceptors, Req } from '@nestjs/common'

import { Public } from '@/common/decorators/public.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'

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

  @Post('/refreshTokenMethod') // 注意：此端點路徑與 auth.guard.ts:validateRefreshToken() 存在耦合關係
  @ResponseMessage('成功刷新Token')
  async refreshTokenMethod(@Req() request) {
    return await this.authService.refreshTokenMethod(request)
  }
}

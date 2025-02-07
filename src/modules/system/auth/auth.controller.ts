import { Body, Controller, Post, UseInterceptors, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { Public } from '@/common/decorators/public.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

import { LoginDto, LoginResponseDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { ApiHeader } from '@nestjs/swagger'

@Controller('/auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: '登入' })
  @ApiResponse({ type: LoginResponseDto })
  @ResponseMessage('登入成功')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @ApiHeader({ name: 'authorization' })
  @ApiHeader({ name: 'refresh-token' })
  @Post('/refreshTokenMethod') // 注意：此端點路徑與 auth.guard.ts:validateRefreshToken() 存在耦合關係
  @ApiOperation({ summary: '刷新Token', description: '！！該介面無法使用swagger測試，但是功能是正確生效的' })
  @ResponseMessage('成功刷新Token')
  async refreshTokenMethod(@Req() request) {
    return await this.authService.refreshTokenMethod(request)
  }
}

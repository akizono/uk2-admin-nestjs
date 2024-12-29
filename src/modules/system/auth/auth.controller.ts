import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from '@/common/decorators/public.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
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
}

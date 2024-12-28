import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { SystemAuthService } from './system.auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from '../../common/decorators/public.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

@Controller('system/auth')
@UseInterceptors(TransformInterceptor)
export class SystemAuthController {
  constructor(private readonly systemAuthService: SystemAuthService) {}

  @Public()
  @Post('/login')
  @ResponseMessage('登入成功')
  async login(@Body() loginDto: LoginDto) {
    return await this.systemAuthService.login(loginDto)
  }
}

import { Body, Controller, Post } from '@nestjs/common'
import { SystemAuthService } from './system.auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from '../../common/decorators/public.decorator'

@Controller('system/auth')
export class SystemAuthController {
  constructor(private readonly systemAuthService: SystemAuthService) {}

  @Post('/login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return await this.systemAuthService.login(loginDto)
  }
}

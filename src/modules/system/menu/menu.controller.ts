import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

import { MsgResponseDto } from '@/utils/response-dto'

import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'

@Controller('/menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/create')
  @ApiOperation({ summary: '建立菜單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('建立菜單成功')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }
}

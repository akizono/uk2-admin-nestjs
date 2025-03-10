import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { MenuService } from './menu.service'
import { CreateMenuReqDto } from './dto/menu.req.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'

@Controller('/menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/create')
  @HasPermission('system:menu:create')
  @ApiOperation({ summary: '建立菜單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('建立菜單成功')
  create(@Body() createMenuReqDto: CreateMenuReqDto) {
    return this.menuService.create(createMenuReqDto)
  }
}

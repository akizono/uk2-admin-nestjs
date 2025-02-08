import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { MsgResponseDto } from '@/utils/response-dto'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

import { CreateRoleMenuDto } from './dto/create-role-menu'
import { RoleMenuService } from './role-menu.service'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

@Controller('role-menu')
@UseInterceptors(TransformInterceptor)
export class RoleMenuController {
  constructor(private readonly roleMenuService: RoleMenuService) {}

  @Post('/create')
  @ApiOperation({ summary: '角色綁定菜單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('角色綁定菜單成功')
  async create(@Body() createRoleMenuDto: CreateRoleMenuDto) {
    await this.roleMenuService.create(createRoleMenuDto)
  }
}

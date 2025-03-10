import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { RoleMenuService } from './role-menu.service'
import { CreateRoleMenuReqDto } from './dto/role-menu.req.dto'

import { MsgResponseDto } from '@/utils/response-dto'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { HasPermission } from '@/common/decorators/has-permission.decorator'

@Controller('role-menu')
@UseInterceptors(TransformInterceptor)
export class RoleMenuController {
  constructor(private readonly roleMenuService: RoleMenuService) {}

  @Post('/create')
  @HasPermission('system:role-menu:create')
  @ApiOperation({ summary: '角色綁定菜單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('角色綁定菜單成功')
  async create(@Body() createRoleMenuReqDto: CreateRoleMenuReqDto) {
    await this.roleMenuService.create(createRoleMenuReqDto)
  }
}

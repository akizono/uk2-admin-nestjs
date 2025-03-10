import { Body, Controller, Get, Query, Post, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { RoleService } from './role.service'
import { CreateRoleReqDto, FindRoleReqDto } from './dto/role.req.dto'
import { FindRoleResDto } from './dto/role.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'

@Controller('/role')
@UseInterceptors(TransformInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @HasPermission('system:role:create')
  @ApiOperation({ summary: '建立角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('建立角色成功')
  create(@Body() createRoleReqDto: CreateRoleReqDto) {
    return this.roleService.create(createRoleReqDto)
  }

  @Get('/page')
  @HasPermission('system:role:page')
  @ApiOperation({ summary: '取得角色分頁列表' })
  @ApiResponse({ type: FindRoleResDto })
  @ResponseMessage('取得角色分頁列表成功')
  find(@Query() findRoleReqDto: FindRoleReqDto) {
    return this.roleService.find(findRoleReqDto)
  }
}

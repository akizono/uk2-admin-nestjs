import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'

@Controller('/role')
@UseInterceptors(TransformInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @ResponseMessage('創建角色成功')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get('/code/:code')
  @ResponseMessage('獲取角色詳情成功')
  findOneByCode(@Param('code') code: string) {
    return this.roleService.findOneByCode(code)
  }
}

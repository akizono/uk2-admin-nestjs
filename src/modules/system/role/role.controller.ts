import { Body, Controller, Get, Query, Post, UseInterceptors } from '@nestjs/common'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { FindRoleDto } from './dto/find-role.dto'
@Controller('/role')
@UseInterceptors(TransformInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @ResponseMessage('建立角色成功')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get('')
  @ResponseMessage('查詢角色成功')
  find(@Query() findRoleDto: FindRoleDto) {
    return this.roleService.find(findRoleDto)
  }
}

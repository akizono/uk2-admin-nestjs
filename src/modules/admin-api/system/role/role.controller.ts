import { Body, Controller, Get, Query, Post, UseInterceptors, Put, Delete, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { RoleService } from './role.service'
import { CreateRoleReqDto, FindRoleReqDto, UpdateRoleReqDto } from './dto/role.req.dto'
import { FindRoleResDto } from './dto/role.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/admin-api/system/role')
@UseInterceptors(TransformInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @HasPermission('system:role:create')
  @Operation({ type: OperationType.CREATE, name: '建立角色', module: 'system-role' })
  @ApiOperation({ summary: '建立角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('建立角色成功')
  create(@Body() createRoleReqDto: CreateRoleReqDto) {
    return this.roleService.create(createRoleReqDto)
  }

  @Get('/list')
  @HasPermission('system:role:query')
  @Operation({ type: OperationType.READ, name: '取得角色分頁列表', module: 'system-role' })
  @ApiOperation({ summary: '取得角色分頁列表' })
  @ApiResponse({ type: FindRoleResDto })
  @ResponseMessage('取得角色分頁列表成功')
  find(@Query() findRoleReqDto: FindRoleReqDto) {
    return this.roleService.find(findRoleReqDto)
  }

  @Put('/update')
  @HasPermission('system:role:update')
  @Operation({ type: OperationType.UPDATE, name: '更新角色', module: 'system-role' })
  @ApiOperation({ summary: '更新角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新角色成功')
  update(@Body() updateRoleReqDto: UpdateRoleReqDto) {
    return this.roleService.update(updateRoleReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:role:delete')
  @Operation({ type: OperationType.DELETE, name: '刪除角色', module: 'system-role' })
  @ApiOperation({ summary: '刪除角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除角色成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.roleService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:role:block')
  @Operation({ type: OperationType.UPDATE, name: '封鎖角色', module: 'system-role' })
  @ApiOperation({ summary: '封鎖角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖角色成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.roleService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:role:unblock')
  @Operation({ type: OperationType.UPDATE, name: '解封鎖角色', module: 'system-role' })
  @ApiOperation({ summary: '解封鎖角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖角色成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.roleService.unblock(id)
  }
}

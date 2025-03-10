import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { UserRoleService } from './user-role.service'
import { CreateUserRoleReqDto } from './dto/user-role.req.dto'

import { MsgResponseDto } from '@/utils/response-dto'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { HasPermission } from '@/common/decorators/has-permission.decorator'

@Controller('/user-role')
@UseInterceptors(TransformInterceptor)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post('/create')
  @HasPermission('system:user-role:create')
  @ApiOperation({ summary: '使用者綁定角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('使用者綁定角色成功')
  create(@Body() createUserRoleReqDto: CreateUserRoleReqDto) {
    return this.userRoleService.create(createUserRoleReqDto)
  }
}

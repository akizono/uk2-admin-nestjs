import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'

import { MsgResponseDto } from '@/utils/response-dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { CreateUserRoleDto } from './dto/create-user-role-dto'
import { UserRoleService } from './user-role.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('/user-role')
@UseInterceptors(TransformInterceptor)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post('/create')
  @ApiOperation({ summary: '使用者綁定角色' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('使用者綁定角色成功')
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService.create(createUserRoleDto)
  }
}

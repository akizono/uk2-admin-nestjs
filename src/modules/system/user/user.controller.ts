import { Body, Controller, Delete, Param, Get, Post, Put, UseInterceptors, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { HasPermission } from '@/common/decorators/has-permission.decorator'

import { MsgResponseDto } from '@/utils/response-dto'

import { UserService } from './user.service'
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUserDto, FindUserResponseDto } from './dto/find-user.dto'

@Controller('/user')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @ApiOperation({ summary: '建立使用者' })
  @ApiResponse({ type: CreateUserResponseDto })
  @ResponseMessage('建立使用者成功')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @HasPermission('system:user:find')
  @ApiOperation({ summary: '取得使用者列表' })
  @ApiResponse({ type: FindUserResponseDto })
  @ResponseMessage('獲取使用者列表成功')
  find(@Query() findUserDto: FindUserDto) {
    return this.userService.find(findUserDto)
  }

  @Put('/update')
  @ApiOperation({ summary: '更新使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新使用者成功')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: '刪除使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除使用者成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.userService.delete(id)
  }

  @Put('/block/:id')
  @ApiOperation({ summary: '封鎖使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖使用者成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.userService.block(id)
  }

  @Put('/unblock/:id')
  @ApiOperation({ summary: '解封使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封使用者成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.userService.unblock(id)
  }
}

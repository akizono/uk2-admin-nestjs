import { Body, Controller, Delete, Param, Get, Post, Put, UseInterceptors, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { UserService } from './user.service'
import {
  BindEmailOrMobileReqDto,
  CreateUserReqDto,
  FindUserReqDto,
  SendBindEmailReqDto,
  SendBindMobileReqDto,
  UpdatePersonalInfoReqDto,
  UpdatePersonalPasswordReqDto,
  UpdateUserReqDto,
} from './dto/user.req.dto'
import { CreateUserResDto, FindUserResDto } from './dto/user.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { MsgResponseDto } from '@/utils/response-dto'

@Controller('/admin-api/system/user')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @HasPermission('system:user:create')
  @ApiOperation({ summary: '建立使用者' })
  @ApiResponse({ type: CreateUserResDto })
  @ResponseMessage('建立使用者成功')
  create(@Body() createUserReqDto: CreateUserReqDto) {
    return this.userService.create(createUserReqDto)
  }

  @Get('/page')
  @HasPermission('system:user:page')
  @ApiOperation({ summary: '取得使用者分頁列表' })
  @ApiResponse({ type: FindUserResDto })
  @ResponseMessage('取得使用者分頁列表成功')
  find(@Query() findUserReqDto: FindUserReqDto) {
    return this.userService.find(findUserReqDto)
  }

  @Put('/update')
  @HasPermission('system:user:update')
  @ApiOperation({ summary: '更新使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新使用者成功')
  update(@Body() updateUserReqDto: UpdateUserReqDto) {
    return this.userService.update(updateUserReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:user:delete')
  @ApiOperation({ summary: '刪除使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除使用者成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.userService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:user:block')
  @ApiOperation({ summary: '封鎖使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖使用者成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.userService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:user:unblock')
  @ApiOperation({ summary: '解封使用者' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封使用者成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.userService.unblock(id)
  }

  @Post('/send-bind-email')
  @HasPermission('system:user:send-bind-email')
  @ApiOperation({ summary: '發送用於綁定信箱的「驗證碼」到使用者信箱' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('修改個人資訊成功')
  async sendBindEmail(@Body() sendBindEmailReqDto: SendBindEmailReqDto) {
    return this.userService.sendBindEmail(sendBindEmailReqDto)
  }

  @Post('/send-bind-mobile')
  @HasPermission('system:user:send-bind-mobile')
  @ApiOperation({ summary: '發送用於綁定手機號碼的「驗證碼」到使用者手機' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('發送用於綁定手機號碼的「驗證碼」到使用者手機成功')
  async sendBindMobile(@Body() sendBindMobileReqDto: SendBindMobileReqDto) {
    return this.userService.sendBindMobile(sendBindMobileReqDto)
  }

  @Put('/bind-email-or-mobile')
  @HasPermission('system:user:bind-email-or-mobile')
  @ApiOperation({ summary: '綁定信箱或者手機' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('綁定信箱或者手機成功')
  async bindEmailOrMobile(@Body() bindEmailOrMobileReqDto: BindEmailOrMobileReqDto) {
    return this.userService.bindEmailOrMobile(bindEmailOrMobileReqDto)
  }

  @Put('/update-personal-info')
  @HasPermission('system:user:update-personal-info')
  @ApiOperation({ summary: '修改個人資訊' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('修改個人資訊成功')
  async updatePersonalInfo(@Body() updatePersonalInfoReqDto: UpdatePersonalInfoReqDto) {
    return this.userService.updatePersonalInfo(updatePersonalInfoReqDto)
  }

  @Get('/get-personal-info')
  @HasPermission('system:user:get-personal-info')
  @ApiOperation({ summary: '獲取個人資訊' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('獲取個人資訊成功')
  async getPersonalInfo() {
    return this.userService.getPersonalInfo()
  }

  @Put('/update-personal-password')
  @HasPermission('system:user:update-personal-password')
  @ApiOperation({ summary: '修改個人密碼' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('修改個人密碼成功')
  async updatePersonalPassword(@Body() updatePersonalPasswordReqDto: UpdatePersonalPasswordReqDto) {
    return this.userService.updatePersonalPassword(updatePersonalPasswordReqDto)
  }
}

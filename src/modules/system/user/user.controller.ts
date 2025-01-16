import { Body, Controller, Delete, Param, Get, Post, Put, UseInterceptors } from '@nestjs/common'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('/user')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ResponseMessage('獲取用戶列表成功')
  findAll() {
    return this.userService.findAll()
  }

  @Get('/id/:id')
  @ResponseMessage('獲取用戶詳情成功')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(id)
  }

  @Get('/username/:username')
  @ResponseMessage('獲取用戶詳情成功')
  async findOneByUsername(@Param('username') username: string) {
    return await this.userService.findOneByUsername(username)
  }

  @Post('/create')
  @ResponseMessage('創建用戶成功')
  createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Put('/update')
  @ResponseMessage('更新用戶成功')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }

  @Delete('/delete/:id')
  @ResponseMessage('刪除用戶成功')
  delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}

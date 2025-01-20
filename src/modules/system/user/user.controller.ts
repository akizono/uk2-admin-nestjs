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

  @Post('/create')
  @ResponseMessage('建立使用者成功')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ResponseMessage('獲取使用者列表成功')
  findAll() {
    return this.userService.findAll()
  }

  @Get('/id/:id')
  @ResponseMessage('獲取使用者詳情成功')
  async findOneById(@Param('id') id: string) {
    return await this.userService.findOneById(id)
  }

  @Get('/username/:username')
  @ResponseMessage('獲取使用者詳情成功')
  async findOneByUsername(@Param('username') username: string) {
    return await this.userService.findOneByUsername(username)
  }

  @Put('/update')
  @ResponseMessage('更新使用者成功')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }

  @Delete('/delete/:id')
  @ResponseMessage('刪除使用者成功')
  delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}

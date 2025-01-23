import { Body, Controller, Delete, Param, Get, Post, Put, UseInterceptors, Query } from '@nestjs/common'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUserDto } from './dto/find-user.dto'

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
  find(@Query() findUserDto: FindUserDto) {
    return this.userService.find(findUserDto)
  }

  @Put('/update')
  @ResponseMessage('更新使用者成功')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }

  @Delete('/delete/:id')
  @ResponseMessage('刪除使用者成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.userService.delete(id)
  }
}

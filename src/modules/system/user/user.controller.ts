import { Body, Controller, Delete, Param, Get, Post, Put, ParseIntPipe, UseInterceptors } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor'
import { ResponseMessage } from '../../../common/decorators/response-message.decorator'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('/user')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ResponseMessage('获取用户列表成功')
  findAll() {
    return this.userService.findAll()
  }

  @Get('/id/:id')
  @ResponseMessage('获取用户详情成功')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneById(id)
    return user
  }

  @Get('/username/:username')
  @ResponseMessage('获取用户详情成功')
  async findOneByUsername(@Param('username') username: string) {
    const user = await this.userService.findOneByUsername(username)
    return user
  }

  @Post('/create')
  @ResponseMessage('创建用户成功')
  createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Put('/update')
  @ResponseMessage('更新用户成功')
  updateOne(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }

  @Delete('/delete/:id')
  @ResponseMessage('刪除用戶成功')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }
}

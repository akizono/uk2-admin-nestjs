import { Body, Controller, Delete, Param, Get, Post, Put, ParseIntPipe, UseInterceptors } from '@nestjs/common'
import { SystemUserService } from './system.user.service'
import { CreateSystemUserDto } from './dto/create-system-user.dto'
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import { UpdateSystemUserDto } from './dto/update-system-user.dto'

@Controller('/system/user')
@UseInterceptors(TransformInterceptor)
export class SystemUserController {
  constructor(private readonly systemUserService: SystemUserService) {}

  @Get('/')
  @ResponseMessage('获取用户列表成功')
  findAll() {
    return this.systemUserService.findAll()
  }

  @Get('/id/:id')
  @ResponseMessage('获取用户详情成功')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.systemUserService.findOneById(id)
    return user
  }

  @Get('/username/:username')
  @ResponseMessage('获取用户详情成功')
  async findOneByUsername(@Param('username') username: string) {
    const user = await this.systemUserService.findOneByUsername(username)
    return user
  }

  @Post('/create')
  @ResponseMessage('创建用户成功')
  createOne(@Body() createUserDto: CreateSystemUserDto) {
    return this.systemUserService.create(createUserDto)
  }

  @Put('/update')
  @ResponseMessage('更新用户成功')
  updateOne(@Body() updateUserDto: UpdateSystemUserDto) {
    return this.systemUserService.update(updateUserDto)
  }

  @Delete('/delete/:id')
  @ResponseMessage('刪除用戶成功')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.systemUserService.delete(id)
  }
}

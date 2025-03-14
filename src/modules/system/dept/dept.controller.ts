import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { DeptService } from './dept.service'
import { CreateDeptReqDto, FindDeptReqDto, UpdateDeptReqDto } from './dto/dept.req.dto'
import { CreateDeptResDto, FindDeptResDto } from './dto/dept.res.dto'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { MsgResponseDto } from '@/utils/response-dto'

@Controller('/system/dept')
@UseInterceptors(TransformInterceptor)
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post('/create')
  @HasPermission('system:dept:create')
  @ApiOperation({ summary: '建立部門' })
  @ApiResponse({ type: CreateDeptResDto })
  @ResponseMessage('建立部門成功')
  create(@Body() createDeptReqDto: CreateDeptReqDto) {
    return this.deptService.create(createDeptReqDto)
  }

  @Get('/page')
  @HasPermission('system:dept:page')
  @ApiOperation({ summary: '取得部門分頁列表' })
  @ApiResponse({ type: FindDeptResDto })
  @ResponseMessage('取得部門分頁列表成功')
  find(@Query() findDeptReqDto: FindDeptReqDto) {
    return this.deptService.find(findDeptReqDto)
  }

  @Put('/update')
  @HasPermission('system:dept:update')
  @ApiOperation({ summary: '更新部門' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新部門成功')
  update(@Body() updateDeptReqDto: UpdateDeptReqDto) {
    return this.deptService.update(updateDeptReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:dept:delete')
  @ApiOperation({ summary: '刪除部門' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除部門成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.deptService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:dept:block')
  @ApiOperation({ summary: '封鎖部門' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖部門成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.deptService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:dept:unblock')
  @ApiOperation({ summary: '解封鎖部門' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖部門成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.deptService.unblock(id)
  }
}

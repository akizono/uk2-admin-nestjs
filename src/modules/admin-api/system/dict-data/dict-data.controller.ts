import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreateDictDataReqDto, FindDictDataReqDto, UpdateDictDataReqDto } from './dto/dict-data.req.dto'
import { DictDataService } from './dict-data.service'
import { CreateDictDataResDto, FindDictDataResDto } from './dto/dict-data.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

@Controller('/admin-api/system/dict-data')
@UseInterceptors(TransformInterceptor)
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Post('/create')
  @HasPermission('system:dict-data:create')
  @ApiOperation({ summary: '新增字典數據' })
  @ApiResponse({ type: CreateDictDataResDto })
  @ResponseMessage('新增字典數據成功')
  create(@Body() createDictDataReqDto: CreateDictDataReqDto) {
    return this.dictDataService.create(createDictDataReqDto)
  }

  @Get('/page')
  @HasPermission('system:dict-data:page')
  @ApiOperation({ summary: '分頁查詢字典數據' })
  @ApiResponse({ type: FindDictDataResDto })
  @ResponseMessage('分頁查詢字典數據成功')
  find(@Query() findDictDataReqDto: FindDictDataReqDto) {
    return this.dictDataService.find(findDictDataReqDto)
  }

  @Put('/update')
  @HasPermission('system:dict-data:update')
  @ApiOperation({ summary: '更新字典數據' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新字典數據成功')
  update(@Body() updateDictDataReqDto: UpdateDictDataReqDto) {
    return this.dictDataService.update(updateDictDataReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:dict-data:delete')
  @ApiOperation({ summary: '刪除字典數據' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除字典數據成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictDataService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:dict-data:block')
  @ApiOperation({ summary: '封鎖字典數據' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖字典數據成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictDataService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:dict-data:unblock')
  @ApiOperation({ summary: '解封字典數據' })
  @ApiResponse({ type: MsgResponseDto })
  @ResponseMessage('解封字典數據成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictDataService.unblock(id)
  }
}

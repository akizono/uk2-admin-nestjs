import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreateDictDataReqDto, FindDictDataReqDto, UpdateDictDataReqDto } from './dto/dict-data.req.dto'
import { DictDataService } from './dict-data.service'
import { CreateDictDataResDto, FindDictDataResDto, FindOneDictDataResDto } from './dto/dict-data.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/platform-api/system/dict-data')
@UseInterceptors(TransformInterceptor)
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Post('/create')
  @HasPermission('system:dict-data:create')
  @Operation({ type: OperationType.CREATE, name: '新增字典數據', module: 'system-dict-data' })
  @ApiOperation({ summary: '新增字典數據' })
  @ApiResponse({ type: CreateDictDataResDto })
  @ResponseMessage('新增字典數據成功')
  create(@Body() createDictDataReqDto: CreateDictDataReqDto) {
    return this.dictDataService.create(createDictDataReqDto)
  }

  @Get('/list')
  @HasPermission('system:dict-data:query')
  @Operation({ type: OperationType.READ, name: '分頁查詢字典數據', module: 'system-dict-data' })
  @ApiOperation({ summary: '分頁查詢字典數據' })
  @ApiResponse({ type: FindDictDataResDto })
  @ResponseMessage('分頁查詢字典數據成功')
  find(@Query() findDictDataReqDto: FindDictDataReqDto) {
    return this.dictDataService.find(findDictDataReqDto)
  }

  @Get('/get/:id')
  @HasPermission('system:dict-data:query')
  @Operation({ type: OperationType.READ, name: '獲取字典數據資料', module: 'system-dict-data' })
  @ApiOperation({ summary: '獲取字典數據資料' })
  @ApiResponse({ type: FindOneDictDataResDto })
  @ResponseMessage('獲取字典數據資料成功')
  findOne(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictDataService.findOne(id)
  }

  @Put('/update')
  @HasPermission('system:dict-data:update')
  @Operation({ type: OperationType.UPDATE, name: '更新字典數據', module: 'system-dict-data' })
  @ApiOperation({ summary: '更新字典數據' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新字典數據成功')
  update(@Body() updateDictDataReqDto: UpdateDictDataReqDto) {
    return this.dictDataService.update(updateDictDataReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:dict-data:delete')
  @Operation({ type: OperationType.DELETE, name: '刪除字典數據', module: 'system-dict-data' })
  @ApiOperation({ summary: '刪除字典數據' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除字典數據成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictDataService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:dict-data:block')
  @Operation({ type: OperationType.UPDATE, name: '封鎖字典數據', module: 'system-dict-data' })
  @ApiOperation({ summary: '封鎖字典數據' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖字典數據成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictDataService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:dict-data:unblock')
  @Operation({ type: OperationType.UPDATE, name: '解封字典數據', module: 'system-dict-data' })
  @ApiOperation({ summary: '解封字典數據' })
  @ApiResponse({ type: MsgResponseDto })
  @ResponseMessage('解封字典數據成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictDataService.unblock(id)
  }
}

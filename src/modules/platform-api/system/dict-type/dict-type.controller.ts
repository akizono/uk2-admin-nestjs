import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreateDictTypeReqDto, FindDictTypeReqDto, UpdateDictTypeReqDto } from './dto/dict-type.req.dto'
import { DictTypeService } from './dict-type.service'
import { CreateDictTypeResDto, FindDictTypeResDto, FindOneDictTypeResDto } from './dto/dict-type.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/platform-api/system/dict-type')
@UseInterceptors(TransformInterceptor)
export class DictTypeController {
  constructor(private readonly dictTypeService: DictTypeService) {}

  @Post('/create')
  @HasPermission('system:dict-type:create')
  @Operation({ type: OperationType.CREATE, name: '新增字典類型', module: 'system-dict-type' })
  @ApiOperation({ summary: '新增字典類型' })
  @ApiResponse({ type: CreateDictTypeResDto })
  @ResponseMessage('新增字典類型成功')
  create(@Body() createDictTypeReqDto: CreateDictTypeReqDto) {
    return this.dictTypeService.create(createDictTypeReqDto)
  }

  @Get('/list')
  @HasPermission('system:dict-type:query')
  @Operation({ type: OperationType.READ, name: '分頁查詢字典類型', module: 'system-dict-type' })
  @ApiOperation({ summary: '分頁查詢字典類型' })
  @ApiResponse({ type: FindDictTypeResDto })
  @ResponseMessage('分頁查詢字典類型成功')
  find(@Query() findDictTypeReqDto: FindDictTypeReqDto) {
    return this.dictTypeService.find(findDictTypeReqDto)
  }

  @Get('/get/:id')
  @HasPermission('system:dict-type:query')
  @Operation({ type: OperationType.READ, name: '獲取字典類型資料', module: 'system-dict-type' })
  @ApiOperation({ summary: '獲取字典類型資料' })
  @ApiResponse({ type: FindOneDictTypeResDto })
  @ResponseMessage('獲取字典類型資料成功')
  findOne(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictTypeService.findOne(id)
  }

  @Put('/update')
  @HasPermission('system:dict-type:update')
  @Operation({ type: OperationType.UPDATE, name: '更新字典類型', module: 'system-dict-type' })
  @ApiOperation({ summary: '更新字典類型' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新字典類型成功')
  update(@Body() updateDictTypeReqDto: UpdateDictTypeReqDto) {
    return this.dictTypeService.update(updateDictTypeReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:dict-type:delete')
  @Operation({ type: OperationType.DELETE, name: '刪除字典類型', module: 'system-dict-type' })
  @ApiOperation({ summary: '刪除字典類型' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除字典類型成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictTypeService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:dict-type:block')
  @Operation({ type: OperationType.UPDATE, name: '封鎖字典類型', module: 'system-dict-type' })
  @ApiOperation({ summary: '封鎖字典類型' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖字典類型成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictTypeService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:dict-type:unblock')
  @Operation({ type: OperationType.UPDATE, name: '解封字典類型', module: 'system-dict-type' })
  @ApiOperation({ summary: '解封字典類型' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封字典類型成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.dictTypeService.unblock(id)
  }
}

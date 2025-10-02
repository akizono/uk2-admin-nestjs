import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { MultilingualFieldsService } from './multilingual-fields.service'
import {
  CreateMultilingualFieldsReqDto,
  FindMultilingualFieldsReqDto,
  UpdateMultilingualFieldsReqDto,
  ConvertLanguageReqDto,
} from './dto/multilingual-fields.req.dto'
import { CreateMultilingualFieldsResDto, FindMultilingualFieldsResDto } from './dto/multilingual-fields.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/platform-api/system/multilingual-fields')
@UseInterceptors(TransformInterceptor)
export class MultilingualFieldsController {
  constructor(private readonly multilingualFieldsService: MultilingualFieldsService) {}

  @Post('/create')
  @HasPermission('system:multilingual-fields:create')
  @Operation({ type: OperationType.CREATE, name: '建立多語言欄位', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '建立多語言欄位' })
  @ApiResponse({ type: CreateMultilingualFieldsResDto })
  @ResponseMessage('建立多語言欄位成功')
  create(@Body() createMultilingualFieldsReqDto: CreateMultilingualFieldsReqDto) {
    return this.multilingualFieldsService.create(createMultilingualFieldsReqDto)
  }

  @Post('/create-batch')
  @HasPermission('system:multilingual-fields:create')
  @Operation({ type: OperationType.CREATE, name: '批次建立多語言欄位', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '批次建立多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('批次建立多語言欄位成功')
  createBatch(@Body() createMultilingualFieldsReqDtoArr: CreateMultilingualFieldsReqDto[]) {
    return this.multilingualFieldsService.createBatch(createMultilingualFieldsReqDtoArr)
  }

  @Get('/list')
  @HasPermission('system:multilingual-fields:query')
  @Operation({ type: OperationType.READ, name: '取得多語言欄位分頁列表', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '取得多語言欄位分頁列表' })
  @ApiResponse({ type: FindMultilingualFieldsResDto })
  @ResponseMessage('取得多語言欄位分頁列表成功')
  find(@Query() findMultilingualFieldsReqDto: FindMultilingualFieldsReqDto) {
    return this.multilingualFieldsService.find(findMultilingualFieldsReqDto)
  }

  @Put('/update')
  @HasPermission('system:multilingual-fields:update')
  @Operation({ type: OperationType.UPDATE, name: '更新多語言欄位', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '更新多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新多語言欄位成功')
  update(@Body() updateMultilingualFieldsReqDto: UpdateMultilingualFieldsReqDto) {
    return this.multilingualFieldsService.update(updateMultilingualFieldsReqDto)
  }

  @Put('/update-batch')
  @HasPermission('system:multilingual-fields:update')
  @Operation({ type: OperationType.UPDATE, name: '批次更新多語言欄位', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '批次更新多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('批次更新多語言欄位成功')
  updateBatch(@Body() updateMultilingualFieldsReqDtoArr: UpdateMultilingualFieldsReqDto[]) {
    return this.multilingualFieldsService.updateBatch(updateMultilingualFieldsReqDtoArr)
  }

  @Delete('/delete/:id')
  @HasPermission('system:multilingual-fields:delete')
  @Operation({ type: OperationType.DELETE, name: '刪除多語言欄位', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '刪除多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除多語言欄位成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.multilingualFieldsService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:multilingual-fields:block')
  @Operation({ type: OperationType.UPDATE, name: '封鎖多語言欄位', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '封鎖多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖多語言欄位成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.multilingualFieldsService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:multilingual-fields:unblock')
  @Operation({ type: OperationType.UPDATE, name: '解封鎖多語言欄位', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '解封鎖多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖多語言欄位成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.multilingualFieldsService.unblock(id)
  }

  @Post('/ai/convert-language')
  @HasPermission('system:multilingual-fields:ai-convert-language')
  @Operation({ type: OperationType.OTHER, name: '將「字串」轉換為其他語言', module: 'system-multilingual-fields' })
  @ApiOperation({ summary: '將「字串」轉換為其他語言' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('將「字串」轉換為其他語言成功')
  convertLanguage(@Body() convertLanguageReqDto: ConvertLanguageReqDto) {
    return this.multilingualFieldsService.convertLanguage(convertLanguageReqDto)
  }
}

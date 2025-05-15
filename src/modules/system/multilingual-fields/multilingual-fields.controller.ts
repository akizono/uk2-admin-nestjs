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

@Controller('/system/multilingual-fields')
@UseInterceptors(TransformInterceptor)
export class MultilingualFieldsController {
  constructor(private readonly multilingualFieldsService: MultilingualFieldsService) {}

  @Post('/create')
  @HasPermission('system:multilingual-fields:create')
  @ApiOperation({ summary: '建立多語言欄位' })
  @ApiResponse({ type: CreateMultilingualFieldsResDto })
  @ResponseMessage('建立多語言欄位成功')
  create(@Body() createMultilingualFieldsReqDto: CreateMultilingualFieldsReqDto) {
    return this.multilingualFieldsService.create(createMultilingualFieldsReqDto)
  }

  @Post('/create-batch')
  @HasPermission('system:multilingual-fields:create')
  @ApiOperation({ summary: '批次建立多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('批次建立多語言欄位成功')
  createBatch(@Body() createMultilingualFieldsReqDtoArr: CreateMultilingualFieldsReqDto[]) {
    return this.multilingualFieldsService.createBatch(createMultilingualFieldsReqDtoArr)
  }

  @Get('/page')
  @HasPermission('system:multilingual-fields:page')
  @ApiOperation({ summary: '取得多語言欄位分頁列表' })
  @ApiResponse({ type: FindMultilingualFieldsResDto })
  @ResponseMessage('取得多語言欄位分頁列表成功')
  find(@Query() findMultilingualFieldsReqDto: FindMultilingualFieldsReqDto) {
    return this.multilingualFieldsService.find(findMultilingualFieldsReqDto)
  }

  @Put('/update')
  @HasPermission('system:multilingual-fields:update')
  @ApiOperation({ summary: '更新多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新多語言欄位成功')
  update(@Body() updateMultilingualFieldsReqDto: UpdateMultilingualFieldsReqDto) {
    return this.multilingualFieldsService.update(updateMultilingualFieldsReqDto)
  }

  @Put('/update-batch')
  @HasPermission('system:multilingual-fields:update')
  @ApiOperation({ summary: '批次更新多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('批次更新多語言欄位成功')
  updateBatch(@Body() updateMultilingualFieldsReqDtoArr: UpdateMultilingualFieldsReqDto[]) {
    return this.multilingualFieldsService.updateBatch(updateMultilingualFieldsReqDtoArr)
  }

  @Delete('/delete/:id')
  @HasPermission('system:multilingual-fields:delete')
  @ApiOperation({ summary: '刪除多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除多語言欄位成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.multilingualFieldsService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:multilingual-fields:block')
  @ApiOperation({ summary: '封鎖多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖多語言欄位成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.multilingualFieldsService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:multilingual-fields:unblock')
  @ApiOperation({ summary: '解封鎖多語言欄位' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖多語言欄位成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.multilingualFieldsService.unblock(id)
  }

  @Post('/ai/convert-language')
  @HasPermission('system:multilingual-fields:ai-convert-language')
  @ApiOperation({ summary: '將「字串」轉換為其他語言' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('將「字串」轉換為其他語言成功')
  convertLanguage(@Body() convertLanguageReqDto: ConvertLanguageReqDto) {
    return this.multilingualFieldsService.convertLanguage(convertLanguageReqDto)
  }
}

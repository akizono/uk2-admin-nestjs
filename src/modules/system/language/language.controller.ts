import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { LanguageService } from './language.service'
import { CreateLanguageReqDto, FindLanguageReqDto, UpdateLanguageReqDto } from './dto/language.req.dto'
import { CreateLanguageResDto, FindLanguageResDto } from './dto/language.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

@Controller('/system/language')
@UseInterceptors(TransformInterceptor)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post('/create')
  @HasPermission('system:language:create')
  @ApiOperation({ summary: '建立語言' })
  @ApiResponse({ type: CreateLanguageResDto })
  @ResponseMessage('建立語言成功')
  create(@Body() createLanguageReqDto: CreateLanguageReqDto) {
    return this.languageService.create(createLanguageReqDto)
  }

  @Get('/page')
  @HasPermission('system:language:page')
  @ApiOperation({ summary: '取得語言分頁列表' })
  @ApiResponse({ type: FindLanguageResDto })
  @ResponseMessage('取得語言分頁列表成功')
  find(@Query() findLanguageReqDto: FindLanguageReqDto) {
    return this.languageService.find(findLanguageReqDto)
  }

  @Put('/update')
  @HasPermission('system:language:update')
  @ApiOperation({ summary: '更新語言' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新語言成功')
  update(@Body() updateLanguageReqDto: UpdateLanguageReqDto) {
    return this.languageService.update(updateLanguageReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:language:delete')
  @ApiOperation({ summary: '刪除語言' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除語言成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.languageService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:language:block')
  @ApiOperation({ summary: '封鎖語言' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖語言成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.languageService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:language:unblock')
  @ApiOperation({ summary: '解封語言' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封語言成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.languageService.unblock(id)
  }
}

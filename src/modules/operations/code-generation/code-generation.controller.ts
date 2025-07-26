import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CodeGenerationService } from './code-generation.service'
import {
  CreateCodeGenerationReqDto,
  FindCodeGenerationReqDto,
  PreviewEntityCodeReqDto,
  UpdateCodeGenerationReqDto,
  InsertEntityCodeReqDto,
  GetEntityCustomFieldsReqDto,
  PreviewBackendCodeReqDto,
  InsertBackendCodeReqDto,
} from './dto/code-generation.req.dto'
import {
  CreateCodeGenerationResDto,
  FindCodeGenerationResDto,
  GetEntityCustomFieldsResDto,
  PreviewEntityCodeResDto,
  PreviewBackendCodeResDto,
} from './dto/code-generation.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

@Controller('/operations/code-generation')
@UseInterceptors(TransformInterceptor)
export class CodeGenerationController {
  constructor(private readonly codeGenerationService: CodeGenerationService) {}

  @Post('/create')
  @HasPermission('operations:code-generation:create')
  @ApiOperation({ summary: '建立模組' })
  @ApiResponse({ type: CreateCodeGenerationResDto })
  @ResponseMessage('建立模組成功')
  create(@Body() createCodeGenerationReqDto: CreateCodeGenerationReqDto) {
    return this.codeGenerationService.create(createCodeGenerationReqDto)
  }

  @Get('/page')
  @HasPermission('operations:code-generation:page')
  @ApiOperation({ summary: '取得模組分頁列表' })
  @ApiResponse({ type: FindCodeGenerationResDto })
  @ResponseMessage('取得模組分頁列表成功')
  find(@Query() findCodeGenerationReqDto: FindCodeGenerationReqDto) {
    return this.codeGenerationService.find(findCodeGenerationReqDto)
  }

  @Put('/update')
  @HasPermission('operations:code-generation:update')
  @ApiOperation({ summary: '更新模組' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新模組成功')
  update(@Body() updateCodeGenerationReqDto: UpdateCodeGenerationReqDto) {
    return this.codeGenerationService.update(updateCodeGenerationReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('operations:code-generation:delete')
  @ApiOperation({ summary: '刪除模組' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除模組成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.codeGenerationService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('operations:code-generation:block')
  @ApiOperation({ summary: '封鎖模組' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖模組成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.codeGenerationService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('operations:code-generation:unblock')
  @ApiOperation({ summary: '解封鎖模組' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖模組成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.codeGenerationService.unblock(id)
  }

  @Post('/preview-entity-code')
  @HasPermission('operations:code-generation:update')
  @ApiOperation({ summary: '預覽實體的程式碼' })
  @ApiResponse({ type: PreviewEntityCodeResDto })
  @ResponseMessage('成功獲取實體程式碼')
  previewEntityCode(@Body() previewEntityCodeReqDto: PreviewEntityCodeReqDto) {
    return this.codeGenerationService.previewEntityCode(previewEntityCodeReqDto)
  }

  @Post('/insert-entity-code')
  @HasPermission('operations:code-generation:update')
  @ApiOperation({ summary: '插入實體的程式碼' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('插入實體程式碼成功')
  insertEntityCode(@Body() insertEntityCodeReqDto: InsertEntityCodeReqDto) {
    return this.codeGenerationService.insertEntityCode(insertEntityCodeReqDto)
  }

  @Get('/get-entity-custom-fields')
  @HasPermission('operations:code-generation:update')
  @ApiOperation({ summary: '獲取實體的自訂欄位' })
  @ApiResponse({ type: GetEntityCustomFieldsResDto })
  @ResponseMessage('獲取實體的自訂欄位成功')
  getEntityCustomFields(@Query() getEntityCustomFieldsReqDto: GetEntityCustomFieldsReqDto) {
    return this.codeGenerationService.getEntityCustomFields(getEntityCustomFieldsReqDto)
  }

  @Post('/preview-backend-code')
  @HasPermission('operations:code-generation:update')
  @ApiOperation({ summary: '預覽後端代碼' })
  @ApiResponse({ type: PreviewBackendCodeResDto })
  @ResponseMessage('預覽後端代碼成功')
  previewBackendCode(@Body() previewBackendCodeReqDto: PreviewBackendCodeReqDto) {
    return this.codeGenerationService.previewBackendCode(previewBackendCodeReqDto)
  }

  @Post('/insert-backend-code')
  @HasPermission('operations:code-generation:update')
  @ApiOperation({ summary: '插入後端代碼' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('插入後端代碼成功')
  insertBackendCode(@Body() insertBackendCodeReqDto: InsertBackendCodeReqDto) {
    return this.codeGenerationService.insertBackendCode(insertBackendCodeReqDto)
  }
}

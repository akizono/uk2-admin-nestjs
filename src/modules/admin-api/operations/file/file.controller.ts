import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

import { FileService } from './file.service'
import { FindFileReqDto } from './dto/file.req.dto'
import { CreateFileResDto, FindFileResDto } from './dto/file.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'
import { EnvHelper } from '@/utils/env-helper'

@Controller('/admin-api/operations/file')
@UseInterceptors(TransformInterceptor)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @HasPermission('operations:file:create')
  @Operation({ type: OperationType.CREATE, name: '上傳檔案', module: 'operations-file' })
  @ApiOperation({ summary: '上傳檔案（支援單個或多個檔案）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: EnvHelper.getNumber('MAX_FILE_COUNT') }]))
  @ApiResponse({ type: CreateFileResDto })
  @ResponseMessage('上傳檔案成功')
  upload(@UploadedFiles() files: { files: Express.Multer.File[] }) {
    return this.fileService.upload(files)
  }

  @Get('/page')
  @HasPermission('operations:file:page')
  @Operation({ type: OperationType.READ, name: '取得檔案分頁列表', module: 'operations-file' })
  @ApiOperation({ summary: '取得檔案分頁列表' })
  @ApiResponse({ type: FindFileResDto })
  @ResponseMessage('取得檔案分頁列表成功')
  find(@Query() findFileReqDto: FindFileReqDto) {
    return this.fileService.find(findFileReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('operations:file:delete')
  @Operation({ type: OperationType.DELETE, name: '刪除檔案', module: 'operations-file' })
  @ApiOperation({ summary: '刪除檔案' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除檔案成功')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.fileService.delete(id)
  }
}

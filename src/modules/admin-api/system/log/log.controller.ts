import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { LogService } from './log.service'
import { FindLogReqDto } from './dto/log.req.dto'
import { FindLogResDto } from './dto/log.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/admin-api/system/log')
@UseInterceptors(TransformInterceptor)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('/list')
  @HasPermission('system:log:query')
  @Operation({ type: OperationType.READ, name: '取得日誌分頁列表', module: 'system-log' })
  @ApiOperation({ summary: '取得日誌分頁列表' })
  @ApiResponse({ type: FindLogResDto })
  @ResponseMessage('取得日誌分頁列表成功')
  find(@Query() findLogReqDto: FindLogReqDto) {
    return this.logService.find(findLogReqDto)
  }
}

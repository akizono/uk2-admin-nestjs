import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { ScriptExecutionLogService } from './script-execution-log.service'
import { FindScriptExecutionLogReqDto } from './dto/script-execution-log.req.dto'
import { FindScriptExecutionLogResDto } from './dto/script-execution-log.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/admin-api/operations/script-execution-log')
@UseInterceptors(TransformInterceptor)
export class ScriptExecutionLogController {
  constructor(private readonly scriptExecutionLogService: ScriptExecutionLogService) {}

  @Get('/page')
  @HasPermission('operations:script-execution-log:page')
  @Operation({
    type: OperationType.READ,
    name: '取得腳本執行記錄分頁列表',
    module: 'operations-script-execution-log',
  })
  @ApiOperation({ summary: '取得腳本執行記錄分頁列表' })
  @ApiResponse({ type: FindScriptExecutionLogResDto })
  @ResponseMessage('取得腳本執行記錄分頁列表成功')
  find(@Query() findScriptExecutionLogReqDto: FindScriptExecutionLogReqDto) {
    return this.scriptExecutionLogService.find(findScriptExecutionLogReqDto)
  }
}

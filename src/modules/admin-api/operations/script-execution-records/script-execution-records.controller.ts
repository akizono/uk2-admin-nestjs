import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { ScriptExecutionRecordsService } from './script-execution-records.service'
import { FindScriptExecutionRecordsReqDto } from './dto/script-execution-records.req.dto'
import { FindScriptExecutionRecordsResDto } from './dto/script-execution-records.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/admin-api/operations/script-execution-records')
@UseInterceptors(TransformInterceptor)
export class ScriptExecutionRecordsController {
  constructor(private readonly scriptExecutionRecordsService: ScriptExecutionRecordsService) {}

  @Get('/page')
  @HasPermission('operations:script-execution-records:page')
  @Operation({
    type: OperationType.READ,
    name: '取得腳本執行記錄分頁列表',
    module: 'operations-script-execution-records',
  })
  @ApiOperation({ summary: '取得腳本執行記錄分頁列表' })
  @ApiResponse({ type: FindScriptExecutionRecordsResDto })
  @ResponseMessage('取得腳本執行記錄分頁列表成功')
  find(@Query() findScriptExecutionRecordsReqDto: FindScriptExecutionRecordsReqDto) {
    return this.scriptExecutionRecordsService.find(findScriptExecutionRecordsReqDto)
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ScriptExecutionLogEntity } from './entity/script-execution-log.entity'
import { FindScriptExecutionLogReqDto } from './dto/script-execution-log.req.dto'

import { find } from '@/common/services/base.service'

@Injectable()
export class ScriptExecutionLogService {
  constructor(
    @InjectRepository(ScriptExecutionLogEntity)
    private readonly scriptExecutionLogRepository: Repository<ScriptExecutionLogEntity>,
  ) {}

  // 查詢腳本執行記錄
  async find(findScriptExecutionLogReqDto: FindScriptExecutionLogReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findScriptExecutionLogReqDto,
      repository: this.scriptExecutionLogRepository,
      where: {
        isDeleted: 0,
        status: 1,
      },
    })

    return {
      total,
      list,
    }
  }
}

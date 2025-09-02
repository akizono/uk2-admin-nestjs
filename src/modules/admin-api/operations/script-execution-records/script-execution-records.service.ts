import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ScriptExecutionRecordsEntity } from './entity/script-execution-records.entity'
import { FindScriptExecutionRecordsReqDto } from './dto/script-execution-records.req.dto'

import { find } from '@/common/services/base.service'

@Injectable()
export class ScriptExecutionRecordsService {
  constructor(
    @InjectRepository(ScriptExecutionRecordsEntity)
    private readonly scriptExecutionRecordsRepository: Repository<ScriptExecutionRecordsEntity>,
  ) {}

  // 查詢腳本執行記錄
  async find(findScriptExecutionRecordsReqDto: FindScriptExecutionRecordsReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findScriptExecutionRecordsReqDto,
      repository: this.scriptExecutionRecordsRepository,
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

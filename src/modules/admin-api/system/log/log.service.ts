import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { LogEntity } from './entity/log.entity'
import { CreateLogReqDto, FindLogReqDto } from './dto/log.req.dto'

import { create, find } from '@/common/services/base.service'

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  // 新增日誌
  async create(createLogReqDto: CreateLogReqDto) {
    await create({
      dto: createLogReqDto,
      repository: this.logRepository,
      modalName: '日誌',
    })
  }

  // 查詢日誌
  async find(findLogReqDto: FindLogReqDto) {
    // 查詢日誌
    const { list, total } = await find({
      dto: findLogReqDto,
      repository: this.logRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 日誌沒有刪除、更新功能
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ScriptExecutionRecordsController } from './script-execution-records.controller'
import { ScriptExecutionRecordsService } from './script-execution-records.service'
import { ScriptExecutionRecordsEntity } from './entity/script-execution-records.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ScriptExecutionRecordsEntity])],
  controllers: [ScriptExecutionRecordsController],
  providers: [ScriptExecutionRecordsService],
})
export class ScriptExecutionRecordsModule {}

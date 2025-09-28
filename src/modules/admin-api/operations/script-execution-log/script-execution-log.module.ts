import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ScriptExecutionLogController } from './script-execution-log.controller'
import { ScriptExecutionLogService } from './script-execution-log.service'
import { ScriptExecutionLogEntity } from './entity/script-execution-log.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ScriptExecutionLogEntity])],
  controllers: [ScriptExecutionLogController],
  providers: [ScriptExecutionLogService],
  exports: [ScriptExecutionLogService],
})
export class ScriptExecutionLogModule {}

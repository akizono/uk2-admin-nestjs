import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '../user/entity/user.entity'
import { MultilingualFieldsEntity } from '../multilingual-fields/entity/multilingual-fields.entity'

import { LogController } from './log.controller'
import { LogService } from './log.service'
import { LogEntity } from './entity/log.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity, UserEntity, MultilingualFieldsEntity])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}

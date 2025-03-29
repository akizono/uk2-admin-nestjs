import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictTypeController } from './dict-type.controller'
import { DictTypeService } from './dict-type.service'
import { DictTypeEntity } from './entity/dict-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DictTypeEntity])],
  controllers: [DictTypeController],
  providers: [DictTypeService],
})
export class DictTypeModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictTypeModule } from '../dict-type/dict-type.module'

import { DictDataEntity } from './entity/dict-data.entity'
import { DictDataController } from './dict-data.controller'
import { DictDataService } from './dict-data.service'

@Module({
  imports: [TypeOrmModule.forFeature([DictDataEntity]), DictTypeModule],
  controllers: [DictDataController],
  providers: [DictDataService],
  exports: [DictDataService],
})
export class DictDataModule {}

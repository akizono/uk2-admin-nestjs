import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictDataEntity } from './entity/dict-data.entity'
import { DictDataController } from './dict-data.controller'
import { DictDataService } from './dict-data.service'

@Module({
  imports: [TypeOrmModule.forFeature([DictDataEntity])],
  controllers: [DictDataController],
  providers: [DictDataService],
})
export class DictDataModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MultilingualFieldsController } from './multilingual-fields.controller'
import { MultilingualFieldsService } from './multilingual-fields.service'
import { MultilingualFieldsEntity } from './entity/multilingual-fields.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MultilingualFieldsEntity])],
  controllers: [MultilingualFieldsController],
  providers: [MultilingualFieldsService],
  exports: [MultilingualFieldsService],
})
export class MultilingualFieldsModule {}

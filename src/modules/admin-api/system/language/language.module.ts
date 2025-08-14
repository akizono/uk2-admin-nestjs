import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LanguageController } from './language.controller'
import { LanguageService } from './language.service'
import { LanguageEntity } from './entity/language.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LanguageEntity])],
  controllers: [LanguageController],
  providers: [LanguageService],
})
export class LanguageModule {}

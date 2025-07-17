import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CodeGenerationController } from './code-generation.controller'
import { CodeGenerationService } from './code-generation.service'
import { CodeGenerationEntity } from './entity/code-generation.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CodeGenerationEntity])],
  controllers: [CodeGenerationController],
  providers: [CodeGenerationService],
})
export class CodeGenerationModule {}

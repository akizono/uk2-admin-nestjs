import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VerifyCodeController } from './verify-code.controller'
import { VerifyCodeService } from './verify-code.service'
import { VerifyCodeEntity } from './entity/verify-code.entity'

@Module({
  imports: [TypeOrmModule.forFeature([VerifyCodeEntity])],
  controllers: [VerifyCodeController],
  providers: [VerifyCodeService],
  exports: [VerifyCodeService],
})
export class VerifyCodeModule {}

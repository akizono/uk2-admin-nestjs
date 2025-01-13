import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenBlacklistService } from './token-blacklist.service'
import { TokenBlacklistController } from './token-blacklist.controller'
import { TokenBlacklistEntity } from './entity/token-blacklist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TokenBlacklistEntity])],
  controllers: [TokenBlacklistController],
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class TokenBlacklistModule {}

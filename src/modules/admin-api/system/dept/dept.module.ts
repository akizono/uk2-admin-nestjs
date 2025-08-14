import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DeptController } from './dept.controller'
import { DeptService } from './dept.service'
import { DeptEntity } from './entity/dept.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DeptEntity])],
  controllers: [DeptController],
  providers: [DeptService],
})
export class DeptModule {}

import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

// 禁用編輯的欄位
export const disableEditFields = ['isDeleted', 'creator', 'createTime', 'updater', 'updateTime'] as const

export class BaseReqDto {
  @ApiProperty({ description: '備註' })
  @IsOptional()
  @IsString()
  remark: string

  @ApiProperty({ description: '狀態' })
  @IsOptional()
  @IsNumber()
  status: number

  @ApiProperty({ description: '是否刪除' })
  @IsOptional()
  @IsNumber()
  isDeleted: number

  @ApiProperty({ description: '建立人' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  creator: string

  @ApiProperty({ description: '建立時間' })
  @IsOptional()
  @IsDateString()
  createTime: Date

  @ApiProperty({ description: '更新人' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  updater: string

  @ApiProperty({ description: '更新時間' })
  @IsOptional()
  @IsDateString()
  updateTime: Date
}

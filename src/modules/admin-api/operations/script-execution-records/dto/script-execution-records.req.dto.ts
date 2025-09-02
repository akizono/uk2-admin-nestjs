import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export class ScriptExecutionRecordsReqDto extends PartialType(OmitType(BaseReqDto, ['multilingualFields'])) {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '腳本名稱' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '腳本路徑' })
  @IsNotEmpty()
  @IsString()
  path: string

  @ApiProperty({ description: '執行結果' })
  @IsNotEmpty()
  @IsString()
  result: string

  @ApiProperty({ description: '錯誤資訊' })
  @IsOptional()
  @IsString()
  error: string

  @ApiProperty({ description: '退出代碼' })
  @IsOptional()
  @IsNumber()
  exitCode: number

  @ApiProperty({ description: '開始時間' })
  @IsNotEmpty()
  @IsDateString()
  startTime: Date

  @ApiProperty({ description: '結束時間' })
  @IsNotEmpty()
  @IsDateString()
  endTime: Date

  @ApiProperty({ description: '執行耗時(毫秒)' })
  @IsNotEmpty()
  @IsNumber()
  duration: number

  @ApiProperty({ description: '執行環境/伺服器' })
  @IsNotEmpty()
  @IsString()
  environment: string

  @ApiProperty({ description: '腳本類型: shell/python/js等' })
  @IsNotEmpty()
  @IsString()
  type: string
}

export class FindScriptExecutionRecordsReqDto extends PartialType(ScriptExecutionRecordsReqDto) {
  @ApiProperty({ description: '分頁大小', example: 10, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(EnvHelper.getNumber('MAX_PAGE_SIZE'))
  pageSize?: number = 10

  @ApiProperty({ description: '分頁頁碼', example: 1, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(EnvHelper.getNumber('MAX_PAGE_NUMBER'))
  currentPage?: number = 1
}

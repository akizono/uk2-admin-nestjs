import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export class LogReqDto extends PartialType(OmitType(BaseReqDto, ['multilingualFields'])) {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '介面路徑' })
  @IsOptional()
  @IsString()
  path: string

  @ApiProperty({ description: 'HTTP方法' })
  @IsOptional()
  @IsString()
  method: string

  @ApiProperty({ description: '請求參數' })
  @IsOptional()
  @IsString()
  params: string

  @ApiProperty({ description: '請求體數據' })
  @IsOptional()
  @IsString()
  body: string

  @ApiProperty({ description: '查詢參數' })
  @IsOptional()
  @IsString()
  query: string

  @ApiProperty({ description: 'HTTP狀態碼' })
  @IsOptional()
  @IsNumber()
  statusCode: number

  @ApiProperty({ description: '反應時間（毫秒）' })
  @IsOptional()
  @IsNumber()
  responseTime: number

  @ApiProperty({ description: '使用者ID' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  userId: string

  @ApiProperty({ description: '使用者IP位址' })
  @IsOptional()
  @IsString()
  ip: string

  @ApiProperty({ description: '使用者代理（瀏覽器資訊）' })
  @IsOptional()
  @IsString()
  userAgent: string

  @ApiProperty({ description: '是否操作成功' })
  @IsOptional()
  @IsNumber()
  isSuccess: number

  @ApiProperty({ description: '錯誤資訊' })
  @IsOptional()
  @IsString()
  errorMessage: string

  @ApiProperty({ description: '錯誤堆棧' })
  @IsOptional()
  @IsString()
  errorStack: string

  @ApiProperty({ description: '業務模組名' })
  @IsOptional()
  @IsString()
  module: string

  @ApiProperty({ description: '操作類型：CREATE/READ/UPDATE/DELETE' })
  @IsOptional()
  @IsString()
  actionType: string

  @ApiProperty({ description: '操作名稱' })
  @IsOptional()
  @IsString()
  operationName: string

  @ApiProperty({ description: '資源ID' })
  @IsOptional()
  @IsString()
  resourceId: string
}

export class CreateLogReqDto extends PartialType(OmitType(LogReqDto, ['id', ...disableEditFields])) {}

export class FindLogReqDto extends PartialType(LogReqDto) {
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

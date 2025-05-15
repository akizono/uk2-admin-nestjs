import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export class LanguageReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '語言名稱', example: '繁體中文' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '語言代碼', example: 'zh-TW' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({ description: '排序', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sort: number
}

export class CreateLanguageReqDto extends PartialType(OmitType(LanguageReqDto, ['id', ...disableEditFields])) {}

export class FindLanguageReqDto extends PartialType(LanguageReqDto) {
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

export class UpdateLanguageReqDto extends PartialType(OmitType(LanguageReqDto, [...disableEditFields])) {}

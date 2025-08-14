import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export class MultilingualFieldsReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '對應欄位ID' })
  @IsNotEmpty()
  @IsString()
  fieldId: string

  @ApiProperty({ description: '對應語言', example: 'zh-TW' })
  @IsNotEmpty()
  @IsString()
  language: string

  @ApiProperty({ description: '欄位值', example: '測試資料' })
  @IsNotEmpty()
  @IsString()
  value: string
}

export class CreateMultilingualFieldsReqDto extends PartialType(
  OmitType(MultilingualFieldsReqDto, ['id', 'multilingualFields', ...disableEditFields]),
) {}

export class FindMultilingualFieldsReqDto extends PartialType(MultilingualFieldsReqDto) {
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

export class UpdateMultilingualFieldsReqDto extends PartialType(
  OmitType(MultilingualFieldsReqDto, ['multilingualFields', ...disableEditFields]),
) {}

export class ConvertLanguageReqDto {
  @ApiProperty({ description: '要轉換的原始文字' })
  @IsString()
  text: string

  @ApiProperty({ description: '目標語言代碼列表，例如：["zh-TW", "en", "ja"]' })
  @IsArray()
  @IsString({ each: true })
  targetLanguages: string[]
}

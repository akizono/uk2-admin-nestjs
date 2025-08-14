import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

class DictDataReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID', required: true })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '字典類型', required: true })
  @IsNotEmpty()
  @IsString()
  dictType: string

  @ApiProperty({ description: '字典標籤', required: true })
  @IsNotEmpty()
  @IsString()
  label: string

  @ApiProperty({ description: '字典鍵值', required: true })
  @IsNotEmpty()
  @IsString()
  value: string

  @ApiProperty({ description: '數據類型', required: true })
  @IsNotEmpty()
  @IsEnum(['undefined', 'null', 'number', 'string', 'boolean'])
  dataType: string

  @ApiProperty({ description: '排序', required: true })
  @IsNotEmpty()
  @IsNumber()
  sort: number
}

export class CreateDictDataReqDto extends PartialType(
  OmitType(DictDataReqDto, ['id', 'multilingualFields', ...disableEditFields]),
) {}

export class FindDictDataReqDto extends PartialType(DictDataReqDto) {
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

export class UpdateDictDataReqDto extends PartialType(
  OmitType(DictDataReqDto, ['multilingualFields', ...disableEditFields]),
) {}

import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export class FileReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '檔案名稱' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '檔案路徑' })
  @IsNotEmpty()
  @IsString()
  path: string

  @ApiProperty({ description: '檔案URL' })
  @IsNotEmpty()
  @IsString()
  url: string

  @ApiProperty({ description: '檔案類型' })
  @IsNotEmpty()
  @IsString()
  type: string

  @ApiProperty({ description: '檔案大小' })
  @IsNotEmpty()
  @IsNumber()
  size: number
}

class FileItemDto extends PartialType(OmitType(FileReqDto, ['id', 'multilingualFields', ...disableEditFields])) {}

export class CreateFileReqDto {
  @ApiProperty({
    description: '檔案數組',
    type: FileItemDto,
    isArray: true,
  })
  @IsNotEmpty()
  files: FileItemDto[]
}

export class FindFileReqDto extends PartialType(FileReqDto) {
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

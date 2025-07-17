import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export class CodeGenerationReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '名稱', example: '學生管理' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '標識', example: 'student' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({ description: '是否創建資料表', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isCreateTable: number

  @ApiProperty({ description: '是否生成後端代碼', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isCreateBackendCode: number

  @ApiProperty({ description: '是否生成前端代碼', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isCreateFrontendCode: number

  @ApiProperty({ description: '是否導入菜單和權限', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isImportMenuAndPermission: number

  @ApiProperty({ description: '排序', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  sort: number
}

export class CreateCodeGenerationReqDto extends PartialType(
  OmitType(CodeGenerationReqDto, ['id', ...disableEditFields]),
) {}

export class FindCodeGenerationReqDto extends PartialType(CodeGenerationReqDto) {
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

export class UpdateCodeGenerationReqDto extends PartialType(OmitType(CodeGenerationReqDto, [...disableEditFields])) {}

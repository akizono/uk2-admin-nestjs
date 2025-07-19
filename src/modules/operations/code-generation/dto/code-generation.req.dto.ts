import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'

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
  isGenerateTable: number

  @ApiProperty({ description: '是否生成後端代碼', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isGenerateBackendCode: number

  @ApiProperty({ description: '是否生成前端代碼', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isGenerateWebCode: number

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
  OmitType(CodeGenerationReqDto, ['id', 'multilingualFields', ...disableEditFields]),
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

// ------------------ 以下為非CURD代碼 ------------------
export class TableColumnDto {
  @ApiProperty({ description: '欄位名稱(駝峰命名)', example: 'name' })
  @IsString()
  columnName: string

  @ApiProperty({ description: '欄位名稱(下劃線命名)', example: 'name_underline' })
  @IsString()
  columnNameUnderline: string

  @ApiProperty({ description: 'js數據類型', example: 'string' })
  @IsString()
  jsDataType: string

  @ApiProperty({ description: '數據類型', example: 'VARCHAR' })
  @IsString()
  dataType: string

  @ApiProperty({ description: '長度', example: 55, required: false })
  length: number

  @ApiProperty({ description: '是否非空', example: 1 })
  @IsNumber()
  isNotNull: number

  @ApiProperty({ description: '是否自增', example: 0 })
  @IsNumber()
  isAutoIncrement: number

  @ApiProperty({ description: '是否主鍵', example: 0 })
  @IsNumber()
  isPrimaryKey: number

  @ApiProperty({ description: '是否唯一', example: 0 })
  @IsNumber()
  isUnique: number

  @ApiProperty({ description: '預設值', example: 'null', required: false })
  defaultValue: string

  @ApiProperty({ description: '註解', example: '姓名' })
  @IsString()
  comment: string
}

export class PreviewTableCodeReqDto {
  @ApiProperty({ description: '類名稱', example: 'StudentEntity' })
  @IsNotEmpty()
  @IsString()
  className: string

  @ApiProperty({ description: '檔案名稱', example: '1721433600000' })
  @IsNotEmpty()
  @IsString()
  fileName: string

  @ApiProperty({ description: '數據表名稱', example: 'system_user' })
  @IsNotEmpty()
  @IsString()
  tableName: string

  @ApiProperty({ description: '數據表中Column的集合', type: [TableColumnDto] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => TableColumnDto)
  tableColumns: TableColumnDto[]
}

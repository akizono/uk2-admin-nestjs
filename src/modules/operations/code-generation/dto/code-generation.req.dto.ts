import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, Max, Min } from 'class-validator'
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

  @ApiProperty({ description: '是否創建實體', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isGenerateEntity: number

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
export class PreviewEntityCodeReqDto {
  @ApiProperty({ description: '時間戳', example: '1721433600000' })
  @IsNotEmpty()
  @IsString()
  timestamp: string

  @ApiProperty({ description: '類名稱', example: 'SystemUserEntity' })
  @IsNotEmpty()
  @IsString()
  className: string

  @ApiProperty({ description: '檔案名稱', example: 'system-user' })
  @IsNotEmpty()
  @IsString()
  fileName: string

  @ApiProperty({ description: '分割後的名稱', example: ['system', 'user'] })
  @IsNotEmpty()
  @IsArray()
  splitName: string[]

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

export class InsertEntityCodeReqDto extends PreviewEntityCodeReqDto {}

export class GetEntityCustomFieldsReqDto {
  @ApiProperty({ description: '分割的模組標識', example: 'student' })
  @IsNotEmpty()
  @IsString()
  moduleSplitName: string
}

export class PreviewBackendCodeReqDto {
  @ApiProperty({ description: '檔案名稱', example: 'demo-student' })
  @IsNotEmpty()
  @IsString()
  fileName: string

  @ApiProperty({ description: '駝峰命名', example: 'demoStudent' })
  @IsNotEmpty()
  @IsString()
  camelName: string

  @ApiProperty({ description: '時間戳', example: '1753369205113' })
  @IsNotEmpty()
  @IsString()
  timestamp: string

  @ApiProperty({ description: '分割後的名稱', example: ['demo', 'student'] })
  @IsNotEmpty()
  @IsArray()
  moduleSplitName: string[]

  @ApiProperty({ description: '類名稱', example: 'DemoStudent' })
  @IsNotEmpty()
  @IsString()
  classNamePrefix: string

  @ApiProperty({
    description: '範例資料',
    type: 'object',
    additionalProperties: true,
    example: { id: '10', age: '18', name: '張三' },
  })
  @IsNotEmpty()
  @IsObject()
  exampleData: Record<string, any>

  @ApiProperty({ description: '單元名稱', example: '學生' })
  @IsNotEmpty()
  @IsString()
  unitName: string

  @ApiProperty({
    description: '欄位',
    example: {
      'id': {
        'label': 'id主鍵',
        'type': 'string',
        'nullable': false,
      },
      'name': {
        'label': '姓名',
        'type': 'string',
        'nullable': false,
      },
      'age': {
        'label': '年齡',
        'type': 'number',
        'nullable': true,
      },
      'idCard': {
        'label': '證件號碼',
        'type': 'string',
        'nullable': true,
      },
    },
  })
  @IsNotEmpty()
  @IsObject()
  columns: Record<string, { label: string; type: string; nullable: boolean }>
}

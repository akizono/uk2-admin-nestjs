import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'

const MAX_PAGE_SIZE = 2000000000
const MAX_PAGE_NUMBER = 200

export class MenuReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '父級ID（頂級0）', example: '1' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  parentId: string

  @ApiProperty({ description: '菜單名稱', example: '建立使用者' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '菜單權限', example: 'system:user:create' })
  @IsNotEmpty()
  @IsString()
  permission: string

  @ApiProperty({ description: '菜單類型（值查字典）', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  type: number

  @ApiProperty({ description: '排序', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sort: number
}

export class CreateMenuReqDto extends PartialType(OmitType(MenuReqDto, ['id', ...disableEditFields])) {}

export class FindMenuReqDto extends PartialType(MenuReqDto) {
  @ApiProperty({ description: '分頁大小', example: 10, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(MAX_PAGE_SIZE)
  pageSize?: number = 10

  @ApiProperty({ description: '分頁頁碼', example: 1, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(MAX_PAGE_NUMBER)
  currentPage?: number = 1
}

export class UpdateMenuReqDto extends PartialType(OmitType(MenuReqDto, [...disableEditFields])) {}

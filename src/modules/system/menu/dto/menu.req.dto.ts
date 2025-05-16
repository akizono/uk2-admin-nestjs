import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export class MenuReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '父級ID（頂級0）', example: '1' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  parentId: string

  @ApiProperty({ description: '選單名稱', example: '建立使用者' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '路由路徑', example: '/system/user/create' })
  @IsOptional()
  @IsString()
  path: string

  @ApiProperty({ description: '元件路徑', example: 'system/user/create' })
  @IsOptional()
  @IsString()
  component: string

  @ApiProperty({ description: '選單權限', example: 'system:user:create' })
  @IsOptional()
  @IsString()
  permission: string

  @ApiProperty({ description: '選單類型（值查字典）', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  type: number

  @ApiProperty({ description: '選單圖示', example: 'el-icon-user' })
  @IsOptional()
  @IsString()
  icon: string

  @ApiProperty({ description: '外連地址', example: 'https://www.google.com' })
  @IsOptional()
  @IsString()
  link: string

  @ApiProperty({ description: '是否快取', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isCache: number

  @ApiProperty({ description: '是否顯示在標籤', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isShowTag: number

  @ApiProperty({ description: '是否常駐標籤欄', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isPersistentTag: number

  @ApiProperty({ description: '是否顯示在側邊欄', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  isShowSide: number

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
  @Max(EnvHelper.getNumber('MAX_PAGE_SIZE'))
  pageSize?: number = 10

  @ApiProperty({ description: '分頁頁碼', example: 1, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(EnvHelper.getNumber('MAX_PAGE_NUMBER'))
  currentPage?: number = 1
}

export class UpdateMenuReqDto extends PartialType(OmitType(MenuReqDto, [...disableEditFields])) {}

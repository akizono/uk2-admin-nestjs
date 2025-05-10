import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { MAX_PAGE_SIZE, MAX_PAGE_NUMBER } from '@/utils/pagination-config'

class DeptReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID', required: true })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '父級ID（頂級0）', example: '1' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  parentId: string

  @ApiProperty({ description: '部門名稱', required: true })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '部門代碼', required: true })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({ description: '排序', required: true })
  @IsNotEmpty()
  @IsNumber()
  sort: number

  @ApiProperty({ description: '負責人', example: '1' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  leaderUserId: string
}

export class CreateDeptReqDto extends PartialType(OmitType(DeptReqDto, ['id', ...disableEditFields])) {}

export class FindDeptReqDto extends PartialType(DeptReqDto) {
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

export class UpdateDeptReqDto extends PartialType(OmitType(DeptReqDto, [...disableEditFields])) {}

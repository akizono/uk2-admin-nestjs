import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

const MAX_PAGE_SIZE = 200
const MAX_PAGE_NUMBER = 200

class RoleReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '角色代碼' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({ description: '角色名稱' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description: string
}

export class CreateRoleReqDto extends PartialType(OmitType(RoleReqDto, ['id', ...disableEditFields])) {}

export class FindRoleReqDto extends PartialType(RoleReqDto) {
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

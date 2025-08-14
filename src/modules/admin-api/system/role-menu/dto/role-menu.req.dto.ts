import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

class RoleMenuReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  roleId: string

  @ApiProperty({ description: '菜單ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  menuId: string
}

export class CreateRoleMenuReqDto extends PartialType(
  OmitType(RoleMenuReqDto, ['id', 'multilingualFields', ...disableEditFields]),
) {}

export class FindRoleMenuReqDto extends PartialType(RoleMenuReqDto) {
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

export class BatchUpdateRoleMenuReqDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  roleId: string

  @ApiProperty({ description: '菜單IDs' })
  @IsNotEmpty()
  @IsArray()
  menuIds: string[]
}

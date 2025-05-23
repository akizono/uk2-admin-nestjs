import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

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

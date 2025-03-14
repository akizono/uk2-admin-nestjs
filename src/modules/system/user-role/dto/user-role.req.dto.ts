import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

class UserRoleReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '使用者ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  userId: string

  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  roleId: string
}

export class CreateUserRoleReqDto extends PartialType(OmitType(UserRoleReqDto, ['id', ...disableEditFields])) {}

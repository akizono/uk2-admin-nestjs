import { PartialType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'
import { BaseUserDto } from './base-user.dto'

export class UpdateUserDto extends PartialType(
  // 排除 username 欄位
  OmitType(BaseUserDto, ['username'] as const),
) {
  @ApiProperty({ description: '需要更新的使用者 ID' })
  @IsNotEmpty({ message: 'id不能為空' })
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string
}

import { PartialType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

import { CreateUserDto } from './create-user.dto'
import { ApiProperty } from '@nestjs/swagger'

/** 排除 password 欄位 */
const UserDtoWithoutPassword = OmitType(CreateUserDto, ['password'] as const)

export class UpdateUserDto extends PartialType(UserDtoWithoutPassword) {
  @ApiProperty({ description: '需要更新的使用者 ID' })
  @IsNotEmpty({ message: 'id不能為空' })
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string
}

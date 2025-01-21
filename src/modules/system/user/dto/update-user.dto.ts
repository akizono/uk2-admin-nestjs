import { PartialType, OmitType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'

import { CreateUserDto } from './create-user.dto'

/** 排除 password 欄位 */
const UserDtoWithoutPassword = OmitType(CreateUserDto, ['password'] as const)

export class UpdateUserDto extends PartialType(UserDtoWithoutPassword) {
  @IsNotEmpty({ message: 'id不能為空' })
  id: string
}

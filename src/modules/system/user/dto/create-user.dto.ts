import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PasswordGenerator } from 'src/utils/password-generator'

import { BaseUserDto } from './base-user.dto'
import { SingleResponseDto } from '@/utils/response-dto'

export class CreateUserDto extends BaseUserDto {
  @ApiProperty({ description: '密碼' })
  @IsNotEmpty({ message: '密碼不能為空' })
  @MinLength(6, { message: '密碼最少需要 6 個字元' })
  @MaxLength(28, { message: '密碼最多只能 28 個字元' })
  password: string = PasswordGenerator.generate(14)
}

export class CreateUserResponseDto extends SingleResponseDto({
  id: '100',
  password: 'password',
}) {}

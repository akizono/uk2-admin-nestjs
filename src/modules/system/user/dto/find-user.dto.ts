import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional } from 'class-validator'

import { CreateUserDto } from './create-user.dto'

export class FindUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  pageSize?: number = 10

  @IsNotEmpty()
  currentPage?: number = 1

  @IsOptional()
  id?: string
}

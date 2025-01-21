import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional } from 'class-validator'

import { CreateRoleDto } from './create-role.dto'

export class FindRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty()
  pageSize?: number = 10

  @IsNotEmpty()
  currentPage?: number = 1

  @IsOptional()
  id?: string
}

import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { CreateSystemUserDto } from './create-system-user.dto'

export class UpdateSystemUserDto extends PartialType(CreateSystemUserDto) {
  @IsNotEmpty()
  id: number
}

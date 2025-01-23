import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

export class CreateUserRoleDto {
  @ApiProperty({ description: '使用者ID' })
  @IsNotEmpty({ message: '使用者ID不能為空' })
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  userId: string

  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: '角色ID不能為空' })
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  roleId: string
}

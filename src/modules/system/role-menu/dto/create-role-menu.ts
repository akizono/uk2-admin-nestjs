import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

export class CreateRoleMenuDto {
  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty({ message: '角色ID不能為空' })
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  roleId: string

  @ApiProperty({ description: '菜單ID' })
  @IsNotEmpty({ message: '菜單ID不能為空' })
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  menuId: string
}

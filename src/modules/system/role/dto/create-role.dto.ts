import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ description: '角色代碼' })
  @IsNotEmpty({ message: '代碼不能為空' })
  code: string

  @ApiProperty({ description: '角色名稱' })
  @IsNotEmpty({ message: '名稱不能為空' })
  @MinLength(1, { message: '名稱長度至少為 2 個字' })
  @MaxLength(20, { message: '名稱長度最多為 20 個字' })
  name: string

  @ApiProperty({ description: '角色描述', required: false })
  @IsOptional()
  @MaxLength(100, { message: '描述長度最多為 100 個字' })
  description?: string
}

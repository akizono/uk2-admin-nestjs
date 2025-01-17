import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateRoleDto {
  @IsNotEmpty({ message: '代碼不能為空' })
  code: string

  @IsNotEmpty({ message: '名稱不能為空' })
  name: string

  @IsOptional()
  description?: string
}

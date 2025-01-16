import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '使用者名稱不能為空' })
  username: string

  @IsNotEmpty({ message: '密碼不能為空' })
  password: string

  @IsOptional()
  nickname?: string

  @IsOptional()
  remark?: string

  @IsOptional()
  email?: string

  @IsOptional()
  mobile?: string

  @IsOptional()
  sex?: number

  @IsOptional()
  avatar?: string
}

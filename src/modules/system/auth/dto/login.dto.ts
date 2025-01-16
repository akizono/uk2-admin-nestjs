import { IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsNotEmpty({ message: '使用者名稱不能為空' })
  username: string

  @IsNotEmpty({ message: '密碼不能為空' })
  password: string
}

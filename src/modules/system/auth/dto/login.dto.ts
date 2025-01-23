import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/** 登入的測試帳號 */
const testAuth = {
  username: 'admin',
  password: '123456',
}

export class LoginDto {
  @ApiProperty({ description: '使用者名稱', example: testAuth.username })
  @IsNotEmpty({ message: '使用者名稱不能為空' })
  username: string

  @ApiProperty({ description: '使用者密碼', example: testAuth.password })
  @IsNotEmpty({ message: '密碼不能為空' })
  password: string
}

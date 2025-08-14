import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

/** 登入測試帳號 */
const testAuth = {
  username: 'admin',
  password: 'admin123',
}

export class LoginReqDto {
  @ApiProperty({ description: '使用者名稱', example: testAuth.username })
  @IsNotEmpty()
  username: string

  @ApiProperty({ description: '使用者密碼', example: testAuth.password })
  @IsNotEmpty()
  password: string
}

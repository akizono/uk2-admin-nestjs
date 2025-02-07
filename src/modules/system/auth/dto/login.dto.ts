import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { SingleResponseDto } from '@/utils/response-dto'

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

export class LoginResponseDto extends SingleResponseDto({
  userInfo: {
    id: '1',
    username: 'admin',
    nickname: 'string34',
    age: 16,
    sex: 2,
    email: 'test@gmail.com',
    mobile: '0123456789',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzV5RP3xmO6AzNktMCsANm90rNx70RlyZqw&s',
    remark: null,
    status: 1,
  },
  role: ['super_admin', 'common'],
  token: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
}) {}

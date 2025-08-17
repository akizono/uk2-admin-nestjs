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

export class CheckUserHasMobileOrEmailReqDto {
  @ApiProperty({ description: '使用者帳號', example: testAuth.username })
  @IsNotEmpty()
  username: string
}

export class SendResetPasswordEmailReqDto {
  @ApiProperty({ description: '使用者帳號', example: testAuth.username })
  @IsNotEmpty()
  username: string
}

export class SendResetPasswordMobileReqDto {
  @ApiProperty({ description: '使用者帳號', example: testAuth.username })
  @IsNotEmpty()
  username: string
}

export class UpdatePasswordReqDto {
  @ApiProperty({ description: '使用者帳號', example: testAuth.username })
  @IsNotEmpty()
  username: string

  @ApiProperty({ description: '新密碼', example: 'Abc123456!@#' })
  @IsNotEmpty()
  password: string

  @ApiProperty({ description: '驗證碼', example: '123456' })
  @IsNotEmpty()
  verifyCode: string

  @ApiProperty({ description: '驗證碼類型', example: 'email' })
  @IsNotEmpty()
  verifyCodeType: 'email' | 'mobile'
}

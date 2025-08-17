import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

import { CreateUserReqDto } from '@/modules/admin-api/system/user/dto/user.req.dto'

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

// ------------------------------------------------------------
// 以下是「註冊」的相關DTO
// ------------------------------------------------------------

export class SendRegisterEmailReqDto {
  @ApiProperty({ description: '使用者信箱', example: 'test@example.com' })
  @IsNotEmpty()
  email: string
}

export class SendRegisterMobileReqDto {
  @ApiProperty({ description: '使用者手機', example: '0912345678' })
  @IsNotEmpty()
  mobile: string
}

export class RegisterReqDto extends CreateUserReqDto {
  @ApiProperty({ description: '驗證碼', example: '123456' })
  @IsNotEmpty()
  verifyCode: string

  @ApiProperty({ description: '驗證碼類型', example: 'email' })
  @IsNotEmpty()
  verifyCodeType: 'email' | 'mobile'
}

// ------------------------------------------------------------
// 以下是「密碼找回」的相關DTO
// ------------------------------------------------------------

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

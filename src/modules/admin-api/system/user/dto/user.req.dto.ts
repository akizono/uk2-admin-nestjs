import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { StrGenerator } from '@/utils/str-generator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'
import { VerifyCodeType } from '@/modules/admin-api/system/verify-code/dto/verify-code.req.dto'

class UserReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID', required: true })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '帳號', required: true })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ description: '暱稱' })
  @IsOptional()
  @IsString()
  nickname: string

  @ApiProperty({ description: '年齡' })
  @IsOptional()
  @IsNumber()
  age: number

  @ApiProperty({ description: '性別（值查字典）' })
  @IsOptional()
  @IsNumber()
  sex: number

  @ApiProperty({ description: '電子郵件', example: '' })
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty({ description: '手機號碼' })
  @IsOptional()
  @IsString()
  mobile: string

  @ApiProperty({ description: '頭像', example: '' })
  @IsOptional()
  @IsString()
  avatar: string

  @ApiProperty({ description: '部門ID' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  deptId: string

  @ApiProperty({ description: '角色ID陣列' })
  @IsNotEmpty()
  @IsArray()
  roleIds: string[]
}

export class CreateUserReqDto extends PartialType(
  OmitType(UserReqDto, ['id', 'multilingualFields', ...disableEditFields]),
) {
  @ApiProperty({ description: '密碼', required: false })
  @IsNotEmpty()
  @IsString()
  password: string = StrGenerator.generate(14)
}

export class FindUserReqDto extends PartialType(UserReqDto) {
  @ApiProperty({ description: '分頁大小', example: 10, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(EnvHelper.getNumber('MAX_PAGE_SIZE'))
  pageSize?: number = 10

  @ApiProperty({ description: '分頁頁碼', example: 1, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(EnvHelper.getNumber('MAX_PAGE_NUMBER'))
  currentPage?: number = 1
}

export class UpdateUserReqDto extends PartialType(
  OmitType(UserReqDto, ['username', 'multilingualFields', ...disableEditFields]),
) {
  @ApiProperty({ description: '密碼', required: false })
  @IsOptional()
  @IsString()
  password?: string
}

export class UpdatePasswordReqDto {
  @ApiProperty({ description: '使用者ID', required: true, example: '1' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  userId: string

  @ApiProperty({ description: '新密碼', required: true, example: 'Abc123456!@#' })
  @IsNotEmpty()
  @IsString()
  password: string
}

export class SendBindEmailReqDto {
  @ApiProperty({ description: '使用者信箱', example: 'test@example.com' })
  @IsNotEmpty()
  email: string
}

export class SendBindMobileReqDto {
  @ApiProperty({ description: '使用者手機', example: '0912345678' })
  @IsNotEmpty()
  mobile: string
}

export class BindEmailOrMobileReqDto {
  @ApiProperty({ description: '驗證碼', example: '123456' })
  @IsNotEmpty()
  verifyCode: string

  @ApiProperty({ description: '驗證碼類型', example: 'email' })
  @IsNotEmpty()
  verifyCodeType: VerifyCodeType

  @ApiProperty({ description: '使用者信箱', example: 'test@example.com' })
  @IsOptional()
  email: string

  @ApiProperty({ description: '使用者手機', example: '0912345678' })
  @IsOptional()
  mobile: string
}

export class UpdatePersonalInfoReqDto extends PartialType(
  OmitType(UpdateUserReqDto, ['mobile', 'email', 'roleIds', 'deptId', 'id', 'status', 'remark']),
) {}

export class UpdatePersonalPasswordReqDto {
  @ApiProperty({ description: '舊密碼', required: true, example: 'Abc123456!@#' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string

  @ApiProperty({ description: '新密碼', required: true, example: 'def3333!@#' })
  @IsNotEmpty()
  @IsString()
  newPassword: string
}

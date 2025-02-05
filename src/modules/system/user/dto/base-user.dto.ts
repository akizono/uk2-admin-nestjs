import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

enum UserSex {
  SECRET = 0,
  MALE = 1,
  FEMALE = 2,
}

enum UserStatus {
  BLOCKED = 0,
  ACTIVE = 1,
}

export class BaseUserDto {
  @ApiProperty({ description: '使用者名稱' })
  @IsNotEmpty({ message: '使用者名稱不能為空' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: '使用者名稱只能包含英文字母、數字、底線(_)和橫槓(-)' })
  @MinLength(3, { message: '使用者名稱最少需要 3 個字元' })
  @MaxLength(20, { message: '使用者名稱最多只能 20 個字元' })
  username: string

  @ApiProperty({ description: '暱稱', required: false })
  @IsOptional()
  @MaxLength(30, { message: '暱稱最多只能 30 個字元' })
  nickname?: string

  @ApiProperty({ description: '年齡', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: '年齡最少需要 0 歲' })
  @Max(999, { message: '年齡最多只能 999 歲' })
  age?: number

  @ApiProperty({ description: '性別(0: 保密, 1: 男, 2: 女)', required: false })
  @IsOptional()
  @IsEnum(UserSex, { message: '性別填寫錯誤' })
  sex?: number

  @ApiProperty({ description: '電子郵件', required: false })
  @IsOptional()
  @IsEmail({}, { message: '電子郵件格式錯誤' })
  @MaxLength(55, { message: '電子郵件最多只能 55 個字元' })
  email?: string

  @ApiProperty({ description: '手機號碼', required: false })
  @MaxLength(55, { message: '手機號碼最多只能 55 個字元' })
  @IsOptional()
  mobile?: string

  @ApiProperty({ description: '頭像', required: false })
  @MaxLength(255, { message: '頭像連結最多只能 255 個字元' })
  @IsOptional()
  avatar?: string

  @ApiProperty({ description: '備註', required: false })
  @IsOptional()
  @MaxLength(100, { message: '備註最多只能 100 個字元' })
  remark?: string

  @ApiProperty({ description: '狀態', required: false })
  @IsOptional()
  @IsEnum(UserStatus, { message: '狀態填寫錯誤' })
  status?: number
}

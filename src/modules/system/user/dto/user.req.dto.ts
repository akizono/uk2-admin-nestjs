import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { PasswordGenerator } from 'src/utils/password-generator'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

const MAX_PAGE_SIZE = 200
const MAX_PAGE_NUMBER = 200

class UserReqDto {
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

  @ApiProperty({ description: '電子郵件', example: 'test@gmail.com' })
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty({ description: '手機號碼' })
  @IsOptional()
  @IsString()
  mobile: string

  @ApiProperty({ description: '頭像', example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatar: string

  @ApiProperty({ description: '備註' })
  @IsOptional()
  @IsString()
  remark: string

  @ApiProperty({ description: '狀態' })
  @IsOptional()
  @IsNumber()
  status: number

  @ApiProperty({ description: '是否刪除' })
  @IsOptional()
  @IsNumber()
  isDeleted: number
}

export class CreateUserReqDto extends PartialType(OmitType(UserReqDto, ['id', 'isDeleted'])) {
  @ApiProperty({ description: '密碼', required: false })
  @IsNotEmpty()
  @IsString()
  password: string = PasswordGenerator.generate(14)
}

export class FindUserReqDto extends PartialType(UserReqDto) {
  @ApiProperty({ description: '分頁大小', example: 10, required: false })
  @IsNotEmpty()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize?: number = 10

  @ApiProperty({ description: '分頁頁碼', example: 1, required: false })
  @IsNotEmpty()
  @Min(1)
  @Max(MAX_PAGE_NUMBER)
  currentPage?: number = 1
}

export class UpdateUserReqDto extends PartialType(OmitType(UserReqDto, ['username', 'isDeleted'])) {}

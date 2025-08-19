import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { EnvHelper } from '@/utils/env-helper'

export type VerifyCodeType = 'email' | 'mobile'

export class VerifyCodeReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '驗證碼', example: '123456' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({ description: '使用者id', example: '1' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  userId: string

  @ApiProperty({ description: '驗證碼類型: email / mobile', example: 'email' })
  @IsNotEmpty()
  @IsString()
  type: VerifyCodeType

  @ApiProperty({ description: '用戶信箱(type=email)', example: 'test@gmail.com' })
  @IsOptional()
  @IsString()
  userEmail: string

  @ApiProperty({ description: '用戶手機(type=mobile)', example: '0912345678' })
  @IsOptional()
  @IsString()
  userMobile: string

  @ApiProperty({ description: '使用場景（例如：retrieve-password）', example: 'retrieve-password' })
  @IsNotEmpty()
  @IsString()
  scene: string
}

export class CreateVerifyCodeReqDto extends PartialType(
  OmitType(VerifyCodeReqDto, ['id', 'multilingualFields', ...disableEditFields]),
) {}

export class FindVerifyCodeReqDto extends PartialType(VerifyCodeReqDto) {
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

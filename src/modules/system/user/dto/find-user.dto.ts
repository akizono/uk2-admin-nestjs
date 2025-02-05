import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

import { BaseUserDto } from './base-user.dto'

const MAX_PAGE_SIZE = 999999
const MAX_PAGE_NUMBER = 999999

export class FindUserDto extends PartialType(BaseUserDto) {
  @ApiProperty({
    description: '分頁大小',
    example: 10,
    required: false,
  })
  @IsNotEmpty()
  @Min(1, { message: '分頁大小最少需要 1' })
  @Max(MAX_PAGE_SIZE, { message: `分頁大小最多只能 ${MAX_PAGE_SIZE}` })
  pageSize?: number = 10

  @ApiProperty({
    description: '分頁頁碼',
    example: 1,
    required: false,
  })
  @IsNotEmpty()
  @Min(1, { message: '分頁頁碼最少需要 1' })
  @Max(MAX_PAGE_NUMBER, { message: `分頁頁碼最多只能 ${MAX_PAGE_NUMBER}` })
  currentPage?: number = 1

  @ApiProperty({ description: '使用者 ID', required: false })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id?: string
}

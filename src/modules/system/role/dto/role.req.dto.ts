import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

const MAX_PAGE_SIZE = 200
const MAX_PAGE_NUMBER = 200

class RoleReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '角色代碼' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({ description: '角色名稱' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ description: '備註', example: '建立使用者' })
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

export class CreateRoleReqDto extends PartialType(OmitType(RoleReqDto, ['id', 'isDeleted'])) {}

export class FindRoleReqDto extends PartialType(RoleReqDto) {
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

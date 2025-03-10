import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

class UserRoleReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '使用者ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  userId: string

  @ApiProperty({ description: '角色ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  roleId: string

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

export class CreateUserRoleReqDto extends PartialType(OmitType(UserRoleReqDto, ['id', 'isDeleted'])) {}

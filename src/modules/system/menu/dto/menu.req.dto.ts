import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigInt-pipe'

export class MenuReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '菜單名稱', example: '建立使用者' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '菜單權限', example: 'system:user:create' })
  @IsNotEmpty()
  @IsString()
  permission: string

  @ApiProperty({ description: '菜單類型（值查字典）', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  type: number

  @ApiProperty({ description: '排序', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sort: number

  @ApiProperty({ description: '父級ID（頂級0）', example: 0 })
  @IsOptional()
  @IsString()
  parentId: string

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

export class CreateMenuReqDto extends PartialType(OmitType(MenuReqDto, ['id', 'isDeleted'])) {}

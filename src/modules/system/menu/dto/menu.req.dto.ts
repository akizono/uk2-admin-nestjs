import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'

export class MenuReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '父級ID（頂級0）', example: 0 })
  @IsNotEmpty()
  @IsString()
  parentId: string = '0'

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
}

export class CreateMenuReqDto extends PartialType(OmitType(MenuReqDto, ['id', ...disableEditFields])) {}

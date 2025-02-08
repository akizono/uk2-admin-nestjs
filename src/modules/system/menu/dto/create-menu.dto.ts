import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { Transform } from 'class-transformer'

enum MenuType {
  DIRECTORY = 0,
  MENU = 1,
  BUTTON = 2,
}

export class CreateMenuDto {
  @ApiProperty({ description: '名稱' })
  @IsNotEmpty({ message: '名稱不能為空' })
  name: string

  @ApiProperty({ description: '權限' })
  @IsOptional()
  permission: string

  @ApiProperty({ description: '類型' })
  @IsNotEmpty({ message: '類型不能為空' })
  @IsEnum(MenuType, { message: '類型填寫錯誤' })
  type: number

  @ApiProperty({ description: '排序' })
  @IsNotEmpty({ message: '排序不能為空' })
  sort: number

  @ApiProperty({ description: '父級ID', example: '100' })
  @IsOptional()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  parentId: string
}

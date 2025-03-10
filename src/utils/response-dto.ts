import { ApiProperty } from '@nestjs/swagger'

/**
 * 返回分頁列表（包含 total 和 list）
 * @param swagger example 資料範例
 */
export function PaginatedResponseDto<T>(example: T) {
  class ResponseDto {
    @ApiProperty({
      example: {
        total: 1,
        list: [example],
      },
    })
    data: T[]

    @ApiProperty({
      example: 'success!',
    })
    message: string
  }
  return ResponseDto
}

/**
 * 直接返回單一資料（無分頁信息）
 * @param swagger example 資料範例
 */
export function SingleResponseDto<T>(example: T) {
  class ResponseDto {
    @ApiProperty({
      example,
    })
    data: T[]

    @ApiProperty({
      example: 'success!',
    })
    message: string
  }

  return ResponseDto
}

/**
 * 只返回訊息
 */
export function MsgResponseDto() {
  class ResponseDto {
    @ApiProperty({
      example: 'success!',
    })
    message: string
  }

  return ResponseDto
}

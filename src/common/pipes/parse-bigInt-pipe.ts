import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
  // 2^64-1，這是一個常見的 bigint 上限
  private readonly MAX_ALLOWED = BigInt('18446744073709551615')

  transform(value: string) {
    try {
      const bigIntValue = BigInt(value)
      if (bigIntValue < 0) {
        throw new BadRequestException('ID 不能為負數')
      }
      if (bigIntValue > this.MAX_ALLOWED) {
        throw new BadRequestException('ID 太大了！最大值為 2^64-1')
      }
      return bigIntValue.toString()
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new BadRequestException('ID 格式錯誤')
    }
  }
}

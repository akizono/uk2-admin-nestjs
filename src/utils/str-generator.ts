export class StrGenerator {
  private static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
  private static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  private static readonly NUMBERS = '0123456789'
  private static readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  /**
   * 生成指定長度的字串
   * @param length 字串長度，預設為 12
   * @returns 生成的字串
   */
  public static generate(length: number = 12): string {
    const allChars = this.LOWERCASE + this.UPPERCASE + this.NUMBERS + this.SYMBOLS

    // 確保字串至少包含每種字元
    let str =
      this.getRandomChar(this.LOWERCASE) +
      this.getRandomChar(this.UPPERCASE) +
      this.getRandomChar(this.NUMBERS) +
      this.getRandomChar(this.SYMBOLS)

    // 生成字串的隨機字元
    for (let i = str.length; i < length; i++) {
      str += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }

    // 打亂字串順序
    return str
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')
  }

  private static getRandomChar(str: string): string {
    return str.charAt(Math.floor(Math.random() * str.length))
  }

  /**
   * 生成只包含大小寫字母和數字的高隨機性字串
   * @param length 字串長度，預設為12
   * @returns 生成的隨機字串（僅包含大小寫字母和數字）
   *
   * 特點：
   * 1. 使用密碼學安全的隨機數生成器（crypto.getRandomValues）
   * 2. 每個字元都從獨立的隨機源生成
   * 3. 重複機率極低（約1/(62^length)）
   *
   * @example
   * StrGenerator.generateAlphanumeric(16); // "xY7p9K2qR4sT6vW8"
   */
  public static generateAlphanumeric(length: number = 12): string {
    const charset = this.LOWERCASE + this.UPPERCASE + this.NUMBERS
    const randomValues = new Uint32Array(length)

    // 使用密碼學安全的隨機數生成器
    crypto.getRandomValues(randomValues)

    let result = ''
    for (let i = 0; i < length; i++) {
      // 使用模運算確保均勻分布
      result += charset[randomValues[i] % charset.length]
    }

    return result
  }
}

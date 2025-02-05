export class PasswordGenerator {
  private static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
  private static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  private static readonly NUMBERS = '0123456789'
  private static readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  /**
   * 生成指定長度的隨機密碼
   * @param length 密碼長度，預設為 12
   * @returns 生成的隨機密碼
   */
  public static generate(length: number = 12): string {
    const allChars = this.LOWERCASE + this.UPPERCASE + this.NUMBERS + this.SYMBOLS

    // 確保密碼至少包含每種字元
    let password =
      this.getRandomChar(this.LOWERCASE) +
      this.getRandomChar(this.UPPERCASE) +
      this.getRandomChar(this.NUMBERS) +
      this.getRandomChar(this.SYMBOLS)

    // 生成剩餘的隨機字元
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }

    // 打亂密碼順序
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')
  }

  private static getRandomChar(str: string): string {
    return str.charAt(Math.floor(Math.random() * str.length))
  }
}

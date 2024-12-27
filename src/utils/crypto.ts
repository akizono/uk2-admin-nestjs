import { createHash, BinaryToTextEncoding, randomBytes } from 'node:crypto'

/**
 * 密碼加密
 * @param password 未加密的密碼
 * @param algorithm 加密算法
 * @param encoding 編碼
 * @param salt 鹽值
 * @returns 加密後的密碼
 */
export function encryptPassword(
  password: string,
  algorithm: string = 'sha256',
  encoding: BinaryToTextEncoding = 'hex',
  salt?: string,
) {
  const hash = createHash(algorithm) // 創建哈希對象
  const saltValue = salt || randomBytes(16).toString('hex') // 鹽值

  hash.update(salt + password)

  return {
    hashedPassword: hash.digest(encoding),
    salt: saltValue,
  }
}

import { UserEntity } from '@/modules/system/user/entity/user.entity'

// 返回的用戶資訊，不包含密碼和鹽
export type UserWithPassword = Partial<Pick<UserEntity, 'password' | 'salt'>> & Omit<UserEntity, 'password' | 'salt'>

// jwt 的 payload 資訊
export interface Payload {
  sub: string
  type: 'access' | 'refresh'
  jti: string
  iat: number
  exp: number
}

// 包含 jwt 資訊的請求頭
export interface JwtRequest extends Request {
  accessPayload?: Payload
  refreshPayload?: Payload
  accessToken?: string
  refreshToken?: string
}

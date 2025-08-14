import { UserEntity } from '@/modules/admin-api/system/user/entity/user.entity'
import { UserRoleEntity } from '@/modules/admin-api/system/user-role/entity/user-role.entity'

// validateUser 函式中回傳的使用者資訊
export type AuthenticatedUser = {
  // 密碼和鹽是可選的
  password?: string
  salt?: string
  userRoles?: UserRoleEntity[]
  role: string[]
} & {
  // 其他所有 UserEntity 的欄位（除了 password 和 salt）都是必填的
  [K in Exclude<keyof UserEntity, 'password' | 'salt' | 'userRoles'>]: UserEntity[K]
}

// jwt 的 payload 資訊
export interface Payload {
  sub: string
  type: 'access' | 'refresh'
  jti: string
  iat: number
  exp: number
  role: string[]
}

// 包含 jwt 資訊的請求頭
export interface JwtRequest extends Request {
  accessPayload?: Payload
  refreshPayload?: Payload
  accessToken?: string
  refreshToken?: string
}

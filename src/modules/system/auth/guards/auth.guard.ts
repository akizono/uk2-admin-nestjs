// # JWT 路由守衛
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { JwtRequest } from '../types'

import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { TokenBlacklistService } from '@/modules/system/token-blacklist/token-blacklist.service'

function getToken(request, tokenType: 'authorization' | 'refresh-token') {
  const [type, token] = request.headers[tokenType]?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly configService: ConfigService,
  ) {}

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
  }

  private async validateRefreshToken(request: JwtRequest): Promise<boolean> {
    try {
      // 注意：request.url 與 auth.controller.ts:refreshTokenMethod() 存在耦合關係
      if (!(request.url === '/auth/refreshTokenMethod' && request.method === 'POST')) {
        return false
      }

      // 驗證 refreshToken 是否有效
      const refreshToken = getToken(request, 'refresh-token')
      const refreshPayload = await this.jwtService.verifyAsync(refreshToken)
      if (refreshPayload.type !== 'refresh') {
        console.log('認證失敗：refresh token 類型不正確')
        throw new UnauthorizedException()
      }

      // 驗證 refreshToken 是否在黑名單中
      const isRefreshTokenBlacklisted = await this.tokenBlacklistService.findByJwtId(refreshPayload.jti)
      if (isRefreshTokenBlacklisted) {
        console.log('認證失敗：refresh token 已被加入黑名單')
        throw new UnauthorizedException()
      }

      // 解碼並驗證 accessToken 是否有效
      const accessToken = getToken(request, 'authorization')
      const accessPayload = this.jwtService.decode(accessToken)
      if (!accessPayload?.type || accessPayload.type !== 'access') {
        console.log('認證失敗：access token 類型不正確')
        throw new UnauthorizedException()
      }

      // 驗證 accessToken 是否在黑名單中
      const isAccessTokenBlacklisted = await this.tokenBlacklistService.findByJwtId(accessPayload.jti)
      if (isAccessTokenBlacklisted) {
        console.log('認證失敗：access token 已被加入黑名單')
        throw new UnauthorizedException()
      }

      // 驗證兩個令牌的sub'是否相同
      if (accessPayload.sub !== refreshPayload.sub) {
        console.log('認證失敗：access token 與 refresh token 的用戶不匹配')
        throw new UnauthorizedException()
      }

      // 將驗證後的資料附加到 request 上
      Object.assign(request, {
        accessPayload,
        refreshPayload,
        accessToken,
        refreshToken,
      })

      return true
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        console.log('認證失敗：refresh token 驗證過程發生未知錯誤')
      }
      throw new UnauthorizedException()
    }
  }

  private async validateAccessToken(request: Request): Promise<boolean> {
    try {
      // 如果是開發環境，且是 Swagger UI 的請求，則不進行驗證
      const currentEnv = this.configService.get<string>('NODE_ENV')
      const isSwagger = request.headers['referer']?.indexOf('/api-docs') > -1
      if (currentEnv === 'dev' && isSwagger) {
        request['user'] = {
          sub: '1',
          role: ['super_admin'],
          type: 'access',
        }
        return true
      }

      // 驗證 accessToken 是否有效
      const accessPayload = await this.jwtService.verifyAsync(getToken(request, 'authorization') ?? '')

      // 驗證 accessToken 是否在黑名單中
      const isAccessTokenBlacklisted = await this.tokenBlacklistService.findByJwtId(accessPayload.jti)
      if (isAccessTokenBlacklisted) {
        console.log('認證失敗：access token 已被加入黑名單')
        throw new UnauthorizedException()
      }

      // 將驗證後的資料附加到 request 上
      request['user'] = accessPayload
      return true
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        console.log('認證失敗：access token 驗證過程發生未知錯誤')
      }
      throw new UnauthorizedException()
    }
  }

  /**
   * 守衛的實現
   * @param context 上下文
   * @returns 是否通過守衛
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()

      // 獲取路由是否公開
      if (this.isPublicRoute(context)) {
        return true
      }

      // 判斷是否是刷新 token 的介面，如果是則驗證 refreshToken 和 accessToken
      if (await this.validateRefreshToken(request)) {
        return true
      }

      // 驗證 accessToken
      if (await this.validateAccessToken(request)) {
        return true
      }
    } catch (error) {
      throw error
    }
  }
}

// # JWT 路由守衛
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { JwtRequest } from '../types'

import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { TokenBlacklistService } from '@/modules/platform-api/system/token-blacklist/token-blacklist.service'
import { UserService } from '@/modules/platform-api/system/user/user.service'
import { EnvHelper } from '@/utils/env-helper'
import { getToken } from '@/utils/token-helper'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
  }

  /**
   * 驗證使用者狀態（是否被封禁或刪除）
   * @param userId 使用者ID
   * @returns 是否通過驗證
   */
  private async validateUserStatus(request: JwtRequest, userId: string): Promise<boolean> {
    try {
      // 1、查詢使用者
      const userResponse = await this.userService.find({
        id: userId,
      })

      // 2、如果查詢不到這個使用者 則拋出異常（代表使用者不存在）
      if (!userResponse || userResponse.list.length === 0) {
        throw new UnauthorizedException('使用者不存在')
      }
      const user = userResponse.list[0]

      // 3、如果查詢到了這個使用者
      // 3.1 如果status 為0，則拋出異常（代表使用者被封禁）
      if (user.status === 0) {
        throw new UnauthorizedException('使用者已被封禁')
      }

      // 3.2 如果isDeleted 為1，則拋出異常（代表使用者被刪除）
      if (user.isDeleted === 1) {
        throw new UnauthorizedException('使用者已被刪除')
      }

      // 4、將使用者資訊附加到 request 上
      request['user'] = user

      // 5、放行
      return true
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new UnauthorizedException('驗證使用者狀態失敗')
    }
  }

  private async validateRefreshToken(request: JwtRequest): Promise<boolean> {
    try {
      // 注意：request.url 與 auth.controller.ts:refreshTokenMethod() 存在耦合關係
      if (!(request.url === '/platform-api/system/auth/refreshTokenMethod' && request.method === 'POST')) {
        return false
      }

      // 驗證 refreshToken 是否有效
      const refreshToken = getToken(request, 'refresh-token')
      const refreshPayload = await this.jwtService.verifyAsync(refreshToken)
      if (refreshPayload.type !== 'refresh') {
        // console.log('認證失敗：refresh token 類型不正確')
        throw new UnauthorizedException()
      }

      // 驗證 refreshToken 是否在黑名單中
      const isRefreshTokenBlacklisted = await this.tokenBlacklistService.findByJwtId(refreshPayload.jti)
      if (isRefreshTokenBlacklisted) {
        // console.log('認證失敗：refresh token 已被加入黑名單')
        throw new UnauthorizedException()
      }

      // 解碼並驗證 accessToken 是否有效
      const accessToken = getToken(request, 'authorization')
      const accessPayload = this.jwtService.decode(accessToken)
      if (!accessPayload?.type || accessPayload.type !== 'access') {
        // console.log('認證失敗：access token 類型不正確')
        throw new UnauthorizedException()
      }

      // 驗證 accessToken 是否在黑名單中
      const isAccessTokenBlacklisted = await this.tokenBlacklistService.findByJwtId(accessPayload.jti)
      if (isAccessTokenBlacklisted) {
        // console.log('認證失敗：access token 已被加入黑名單')
        throw new UnauthorizedException()
      }

      // 驗證兩個令牌的sub'是否相同
      if (accessPayload.sub !== refreshPayload.sub) {
        // console.log('認證失敗：access token 與 refresh token 的使用者不匹配')
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
        // console.log('認證失敗：refresh token 驗證過程發生未知錯誤')
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
        // 因為swagger發起的請求不攜帶token，所以需要手動設置user資訊，這樣才能通過守衛的驗證
        request['accessPayload'] = {
          sub: EnvHelper.getString('DB_CONSTANT_SWAGGER_DEDICATED_USER_ID'),
          type: 'access',
        }
        return true
      }

      // 驗證 accessToken 是否有效
      const accessToken = getToken(request, 'authorization')
      const accessPayload = await this.jwtService.verifyAsync(accessToken)
      // 將驗證後的資料附加到 request 上
      request['accessPayload'] = accessPayload

      // 如果存在 refreshToken ，則驗證 refreshToken 是否有效
      const refreshToken = getToken(request, 'refresh-token')
      if (refreshToken) {
        const refreshPayload = await this.jwtService.verifyAsync(refreshToken)
        // 將驗證後的資料附加到 request 上
        request['refreshPayload'] = refreshPayload
      }

      // 驗證 accessToken 是否在黑名單中
      const isAccessTokenBlacklisted = await this.tokenBlacklistService.findByJwtId(accessPayload.jti)
      if (isAccessTokenBlacklisted) {
        // console.log('認證失敗：access token 已被加入黑名單')
        throw new UnauthorizedException()
      }

      return true
    } catch {
      // if (!(error instanceof UnauthorizedException)) {
      //   console.log('認證失敗：access token 驗證過程發生未知錯誤')
      // }
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
        // 驗證使用者狀態
        const userId = request.refreshPayload?.sub
        if (userId && (await this.validateUserStatus(request, userId))) {
          return true
        }
      }

      // 驗證 accessToken
      if (await this.validateAccessToken(request)) {
        // 驗證使用者狀態
        const userId = request.accessPayload?.sub
        if (userId && (await this.validateUserStatus(request, userId))) {
          return true
        }
      }

      // 如果所有驗證都失敗，返回 false
      return false
    } catch (error) {
      throw error
    }
  }
}

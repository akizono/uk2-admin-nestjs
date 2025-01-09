import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '@/common/decorators/'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { JwtRequest } from './auth.service'

function getToken(request, tokenType: 'authorization' | 'refresh-token') {
  const [type, token] = request.headers[tokenType]?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
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

      // 驗證 refreshToken
      const refreshToken = getToken(request, 'refresh-token')
      const refreshPayload = await this.jwtService.verifyAsync(refreshToken)
      if (refreshPayload.type !== 'refresh') throw new UnauthorizedException()

      // 解碼並驗證 accessToken
      const accessToken = getToken(request, 'authorization')
      const accessPayload = this.jwtService.decode(accessToken)
      if (!accessPayload?.type || accessPayload.type !== 'access') {
        throw new UnauthorizedException()
      }

      // 驗證兩個令牌的sub'是否相同
      if (accessPayload.sub !== refreshPayload.sub) throw new UnauthorizedException()

      // 將驗證後的資料附加到 request 上
      Object.assign(request, {
        accessPayload,
        refreshPayload,
        accessToken,
        refreshToken,
      })

      return true
    } catch {
      throw new UnauthorizedException()
    }
  }

  private async validateAccessToken(request: Request): Promise<boolean> {
    try {
      const accessPayload = await this.jwtService.verifyAsync(getToken(request, 'authorization') ?? '')
      request['user'] = accessPayload
      return true
    } catch {
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

      // 判斷是否是刷新 token 的介面
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

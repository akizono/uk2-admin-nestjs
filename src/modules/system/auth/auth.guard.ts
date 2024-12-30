import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '@/common/decorators/'
import { JwtService } from '@nestjs/jwt'
import { EnvHelper } from '@/utils/env-helper'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * 守衛的實現
   * @param context 上下文
   * @returns 是否通過守衛
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 獲取路由是否公開
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    // 獲取請求頭中的 token
    const request = context.switchToHttp().getRequest()
    const token = extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    // 驗證 token
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: EnvHelper.getString('JWT_SECRET') })
      request['user'] = payload // 將 payload 添加到 request 中，這樣在所有需要鑒權的介面都可以獲取用戶資訊

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException()
    }
    // 如果 token 驗證成功，則返回 true
    return true
  }
}

function extractTokenFromHeader(request) {
  const [type, token] = request.headers.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}

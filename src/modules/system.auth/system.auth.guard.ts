import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator'

@Injectable()
export class SystemAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * 守衛的實現
   * @param context 上下文
   * @returns 是否通過守衛
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true
    return undefined
  }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'

import { RESPONSE_MESSAGE } from '@/common/decorators/response-message.decorator'

export interface Response<T> {
  data: T
  message: string
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const message = this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || 'success'

    return next.handle().pipe(
      map(data => ({
        data,
        message,
      })),
    )
  }
}

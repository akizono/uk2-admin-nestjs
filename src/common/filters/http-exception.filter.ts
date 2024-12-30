import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException } from '@nestjs/common'
import { isArray } from 'class-validator'
import type { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    let message = (exception.getResponse() as any).message || exception.message

    if (isArray(message)) message = message[0]

    response.status(status).json({
      code: status,
      message,
    })
  }
}

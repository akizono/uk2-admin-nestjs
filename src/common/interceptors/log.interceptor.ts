import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, Inject } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { Request, Response } from 'express'

import { LogService } from '@/modules/admin-api/system/log/log.service'
import { CreateLogReqDto } from '@/modules/admin-api/system/log/dto/log.req.dto'
import { OPERATION_KEY, OperationType } from '@/common/decorators/operation.decorator'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @Inject(LogService) private logService: LogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 獲取請求開始時間
    const startTime = Date.now()
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    // 獲取操作資訊
    const operationInfo = this.reflector.get(OPERATION_KEY, context.getHandler())
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler())

    // 如果設置了跳過日誌記錄，則直接返回
    if (operationInfo?.skipLog) {
      return next.handle()
    }

    // 處理請求
    return next.handle().pipe(
      tap(async data => {
        // 請求成功，記錄日誌
        await this.saveLog({
          request,
          response,
          data,
          operationInfo,
          startTime,
          isSuccess: 1,
          statusCode: response.statusCode,
          errorMessage: null,
          errorStack: null,
          isPublic,
        })
      }),
      catchError(async error => {
        // 請求失敗，記錄錯誤日誌
        await this.saveLog({
          request,
          response,
          data: null,
          operationInfo,
          startTime,
          isSuccess: 0,
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: error.message || '未知錯誤',
          errorStack: error.stack || null,
          isPublic,
        })
        throw error
      }),
    )
  }

  private async saveLog({
    request,
    // response,
    // data,
    operationInfo,
    startTime,
    isSuccess,
    statusCode,
    errorMessage,
    errorStack,
    isPublic,
  }: {
    request: Request
    response: Response
    data: any
    operationInfo: any
    startTime: number
    isSuccess: number
    statusCode: number
    errorMessage: string
    errorStack: string
    isPublic: boolean
  }) {
    try {
      // 計算反應時間
      const responseTime = Date.now() - startTime

      // 獲取使用者ID
      const user = request['user']
      const userId = user?.id

      // 如果是公開路由且沒有使用者ID，則不記錄日誌
      if (isPublic && !userId) {
        return
      }

      // 過濾敏感資訊
      const filteredBody = this.filterSensitiveInfo(request.body)
      const filteredQuery = this.filterSensitiveInfo(request.query)
      const filteredParams = this.filterSensitiveInfo(request.params)

      // 創建日誌對象
      const logData: CreateLogReqDto = {
        path: request.path,
        method: request.method,
        params: filteredParams,
        body: filteredBody,
        query: filteredQuery,
        statusCode,
        responseTime,
        userId,
        ip: this.getClientIp(request),
        userAgent: request.headers['user-agent'],
        isSuccess,
        errorMessage,
        errorStack,
        module: operationInfo?.module || this.getModuleFromPath(request.path),
        actionType: operationInfo?.type || this.guessActionType(request.method),
        operationName: operationInfo?.name,
        resourceId: this.getResourceIdFromRequest(request),
      }

      // 直接使用注入的 LogService
      await this.logService.create(logData)
    } catch (error) {
      // 記錄日誌時出錯，不應影響主要業務邏輯
      console.error('記錄操作日誌失敗:', error)
    }
  }

  private filterSensitiveInfo(data: any): any {
    if (!data) return {}

    // 深拷貝對象以避免修改原始數據
    const filtered = JSON.parse(JSON.stringify(data))

    // 定義敏感欄位列表
    const sensitiveFields = [
      'password',
      'passwordConfirm',
      'oldPassword',
      'newPassword',
      'token',
      'refreshToken',
      'accessToken',
      'refreshToken',
    ]

    // 遞迴過濾敏感資訊
    const recursiveFilter = (obj: any) => {
      if (!obj || typeof obj !== 'object') return

      Object.keys(obj).forEach(key => {
        if (sensitiveFields.includes(key)) {
          obj[key] = '******'
        } else if (typeof obj[key] === 'object') {
          recursiveFilter(obj[key])
        }
      })
    }

    recursiveFilter(filtered)
    return filtered
  }

  private getClientIp(request: Request): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      ''
    ).toString()
  }

  private getModuleFromPath(path: string): string {
    // 從路徑中提取模組名稱，例如 /admin-api/system/user -> system
    const parts = path.split('/')
    if (parts.length >= 3) {
      return parts[2]
    }
    return ''
  }

  private guessActionType(method: string): OperationType {
    switch (method.toUpperCase()) {
      case 'POST':
        return OperationType.CREATE
      case 'GET':
        return OperationType.READ
      case 'PUT':
      case 'PATCH':
        return OperationType.UPDATE
      case 'DELETE':
        return OperationType.DELETE
      default:
        return OperationType.OTHER
    }
  }

  private getResourceIdFromRequest(request: Request): string {
    // 嘗試從URL中提取資源ID
    const path = request.path
    const parts = path.split('/')
    const lastPart = parts[parts.length - 1]

    // 檢查最後一部分是否為數字ID
    if (/^\d+$/.test(lastPart)) {
      return lastPart
    }

    // 嘗試從請求體中獲取ID
    if (request.body && request.body.id) {
      return request.body.id.toString()
    }

    // 嘗試從查詢參數中獲取ID
    if (request.query && request.query.id) {
      return request.query.id.toString()
    }

    return null
  }
}

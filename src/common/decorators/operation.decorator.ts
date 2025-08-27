import { SetMetadata } from '@nestjs/common'

export enum OperationType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  OTHER = 'OTHER',
}

export interface OperationOptions {
  type: OperationType
  name: string
  module?: string
  skipLog?: boolean
}

export const OPERATION_KEY = 'operation'
export const Operation = (options: OperationOptions) => SetMetadata(OPERATION_KEY, options)

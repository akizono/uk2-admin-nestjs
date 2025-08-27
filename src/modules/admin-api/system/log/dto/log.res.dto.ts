import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateLogResDto extends SingleResponseDto({}) {}

export class FindLogResDto extends PaginatedResponseDto({
  id: '1',
  path: '/admin-api/system/log/create',
  method: 'POST',
  params: {},
  body: {},
  query: {},
  statusCode: 200,
  responseTime: 100,
  userId: '1',
  ip: '127.0.0.1',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  isSuccess: 1,
  errorMessage: 'errorMessage',
  errorStack: 'errorStack',
  module: 'module',
  actionType: 'CREATE',
  operationName: '創建使用者',
  resourceId: '1',

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

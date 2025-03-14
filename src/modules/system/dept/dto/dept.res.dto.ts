import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateDeptResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindDeptResDto extends PaginatedResponseDto({
  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
  id: '1',
  parentId: '0',
  name: 'string',
  sort: 0,
  leaderUserId: '1',
}) {}

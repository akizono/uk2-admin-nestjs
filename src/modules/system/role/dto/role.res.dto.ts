import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateRoleResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindRoleResDto extends PaginatedResponseDto({
  'remark': null,
  'status': 1,
  'isDeleted': 0,
  'creator': '-1',
  'createTime': '2025-03-09T18:04:12.000Z',
  'updater': '-1',
  'updateTime': '2025-08-14T02:30:38.000Z',
  'id': '1',
  'code': 'super_admin',
  'name': 'super_admin',
  'description': '超級管理員',
  'sort': 1,
}) {}

import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateDeptResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindDeptResDto extends PaginatedResponseDto({
  id: '1',
  parentId: '0',
  name: 'string',
  sort: 0,
  leaderUserId: '1',
  leaderUser: {
    id: '1',
    username: 'admin',
    nickname: 'Aimi22',
    age: 2,
    sex: 0,
    email: 'admin@uk2-admin.com',
    mobile: '01 258 6632',
    avatar: 'https://example.com/avatar.png',

    remark: 'string',
    status: 1,
    isDeleted: 0,
    creator: '-1',
    createTime: '2025-03-09T18:09:10.000Z',
    updater: '-1',
    updateTime: '2025-03-17T01:12:01.000Z',
  },

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

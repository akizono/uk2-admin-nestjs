import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateLanguageResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindLanguageResDto extends PaginatedResponseDto({
  id: '100',
  name: '繁體中文',
  code: 'zh-TW',
  sort: 1,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

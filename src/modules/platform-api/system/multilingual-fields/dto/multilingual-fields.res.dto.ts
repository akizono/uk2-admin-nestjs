import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateMultilingualFieldsResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindMultilingualFieldsResDto extends PaginatedResponseDto({
  id: '1',
  fieldId: '550e8400-e29b-41d4-a716-446655440000',
  language: 'zh-TW',
  value: '測試資料',

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

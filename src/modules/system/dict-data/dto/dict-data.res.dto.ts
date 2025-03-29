import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateDictDataResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindDictDataResDto extends PaginatedResponseDto({
  id: '1',
  dictTypeId: '1',
  label: 'string',
  value: 'string',
  sort: 0,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateDictTypeResDto extends SingleResponseDto({
  id: '100',
}) {}

const DictTypeResDtoReturn = {
  id: '1',
  name: 'string',
  type: 'string',
  sort: 0,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}

export class FindDictTypeResDto extends PaginatedResponseDto(DictTypeResDtoReturn) {}

export class FindOneDictTypeResDto extends SingleResponseDto(DictTypeResDtoReturn) {}

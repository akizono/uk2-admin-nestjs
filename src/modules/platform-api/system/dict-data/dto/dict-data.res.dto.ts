import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateDictDataResDto extends SingleResponseDto({
  id: '100',
}) {}

const DictDataResDtoReturn = {
  id: '1',
  dictType: 'system_user_sex',
  label: '女',
  value: '1',
  dataType: 'number',
  sort: 0,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}

export class FindDictDataResDto extends PaginatedResponseDto(DictDataResDtoReturn) {}

export class FindOneDictDataResDto extends SingleResponseDto(DictDataResDtoReturn) {}

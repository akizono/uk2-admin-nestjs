import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateMenuResDto extends SingleResponseDto({
  id: '100',
}) {}

const MenuResDtoReturn = {
  id: '1',
  parentId: '0',
  title: '建立使用者',
  name: 'CreateUser',
  permission: 'system:menu:create',
  type: 2,
  sort: 1,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}

export class FindMenuResDto extends PaginatedResponseDto(MenuResDtoReturn) {}

export class FindOneMenuResDto extends SingleResponseDto(MenuResDtoReturn) {}

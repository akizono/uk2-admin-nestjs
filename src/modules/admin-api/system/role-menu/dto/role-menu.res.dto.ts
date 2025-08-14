import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateRoleMenuResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindRoleMenuResDto extends PaginatedResponseDto({
  id: '1',
  roleId: '1',
  menuId: '1',
  menu: {
    id: '1',
    parentId: null,
    name: 'dashboard',
    title: '儀錶板',
    path: '/dashboard',
    component: 'Dashboard',
    permission: 'dashboard:view',
    type: 1,
    icon: 'dashboard',
    link: null,
    isCache: 0,
    isShowTab: 0,
    isPersistentTab: 0,
    isShowSide: 1,
    sort: 0,
  },

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

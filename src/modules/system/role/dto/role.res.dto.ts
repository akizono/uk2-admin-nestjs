import { PaginatedResponseDto } from '@/utils/response-dto'

export class FindRoleResDto extends PaginatedResponseDto({
  id: '1',
  code: 'super_admin',
  name: '超級管理員',
  description: null,
  status: 1,
}) {}

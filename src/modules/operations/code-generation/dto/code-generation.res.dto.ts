import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateCodeGenerationResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindCodeGenerationResDto extends PaginatedResponseDto({
  id: '1',
  name: '學生管理',
  code: 'student',
  isGenerateTable: 0,
  isGenerateBackendCode: 0,
  isGenerateWebCode: 0,
  isImportMenuAndPermission: 0,
  sort: 0,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

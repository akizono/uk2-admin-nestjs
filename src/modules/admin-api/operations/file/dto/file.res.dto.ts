import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateFileResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindFileResDto extends PaginatedResponseDto({
  id: '1',
  name: 'file.jpg',
  path: 'uploads/files/file.jpg',
  url: 'https://example.com/files/file.jpg',
  type: 'image/jpeg',
  size: 1024,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

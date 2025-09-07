import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class UploadFileResDto extends SingleResponseDto({
  files: [
    {
      id: '8',
      uuid: '498b869e-1156-4780-bed5-2e6184a33c41',
      name: 'uk2_admin_test (11).sql',
      path: './498b869e-1156-4780-bed5-2e6184a33c41.sql',
      url: 'http://127.0.0.1:3000/file/498b869e-1156-4780-bed5-2e6184a33c41.sql',
      type: 'application/octet-stream',
      size: 309,

      remark: 'remark',
      status: 0,
      isDeleted: 0,
      creator: '-1',
      createTime: '2025-03-14T04:50:19.000Z',
      updater: null,
      updateTime: null,
    },
  ],
}) {}

export class FindFileResDto extends PaginatedResponseDto({
  id: '8',
  uuid: '498b869e-1156-4780-bed5-2e6184a33c41',
  name: 'uk2_admin_test (11).sql',
  path: './498b869e-1156-4780-bed5-2e6184a33c41.sql',
  url: 'http://127.0.0.1:3000/file/498b869e-1156-4780-bed5-2e6184a33c41.sql',
  type: 'application/octet-stream',
  size: 309,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class UploadFileResDto extends SingleResponseDto({
  files: [
    {
      name: '2024_08_07_08_09_IMG_4768.JPG',
      path: './5a7c250d-cdd4-4800-a35e-302be6169b0c.JPG',
      url: 'http://127.0.0.1:3000/file/5a7c250d-cdd4-4800-a35e-302be6169b0c.JPG',
      type: 'image/jpeg',
      size: 249,
      creator: '19',
      remark: null,
      updater: null,
      updateTime: null,
      status: 1,
      isDeleted: 0,
      createTime: '2025-08-31T17:18:54.000Z',
      id: '1bb0b0f2-7f99-4053-b166-8af54fefd3f3',
    },
  ],
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

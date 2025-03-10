import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateUserResDto extends SingleResponseDto({
  id: '100',
  password: 'password',
}) {}

export class FindUserResDto extends PaginatedResponseDto({
  userInfo: {
    id: '1',
    username: 'username',
    nickname: 'nickname',
    age: 16,
    sex: 2,
    email: 'test@gmail.com',
    mobile: '0123456789',
    avatar: 'https://example.com/avatar.png',
    remark: 'remark',
    status: 1,
  },
  role: ['super_admin', 'common'],
}) {}

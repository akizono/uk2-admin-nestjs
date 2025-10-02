import { SingleResponseDto } from '@/utils/response-dto'

export class LoginResDto extends SingleResponseDto({
  userInfo: {
    id: '1',
    username: 'admin',
    nickname: 'string34',
    age: 16,
    sex: 2,
    email: 'test@gmail.com',
    mobile: '0123456789',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzV5RP3xmO6AzNktMCsANm90rNx70RlyZqw&s',
    remark: null,
    status: 1,
  },
  role: ['super_admin', 'common'],
  token: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
}) {}

export class CheckUserHasMobileOrEmailResDto extends SingleResponseDto({
  hasMobile: true,
  hasEmail: true,
}) {}

export class SendLoginImageVerifyCodeResDto extends SingleResponseDto({
  svg: '<svg><text>123456</text></svg>',
  svgCaptchaId: '1',
}) {}

export class CreateSystemUserDto {
  username: string
  password: string
  salt: string
  nickname: string
  remark: string
  email: string
  mobile: string
  sex: number
  avatar: string
  status: number
  isDeleted: number
  createTime: Date
  updateTime: Date
}

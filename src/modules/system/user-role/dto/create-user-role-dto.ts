import { IsNotEmpty } from 'class-validator'

export class CreateUserRoleDto {
  @IsNotEmpty({ message: '使用者ID不能為空' })
  userId: string

  @IsNotEmpty({ message: '角色ID不能為空' })
  roleId: string
}

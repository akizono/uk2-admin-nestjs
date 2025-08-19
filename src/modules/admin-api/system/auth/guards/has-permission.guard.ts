import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { HAS_PERMISSION_KEY } from '@/common/decorators/has-permission.decorator'
import { RoleService } from '@/modules/admin-api/system/role/role.service'
import { UserService } from '@/modules/admin-api/system/user/user.service'

@Injectable()
export class HasPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 獲取路由上定義的權限標識
    const permission = this.reflector.get<string>(HAS_PERMISSION_KEY, context.getHandler())
    if (!permission) return true

    const request = context.switchToHttp().getRequest()
    const userId = request.user.sub

    // 獲取角色資訊
    const user = await this.userService.getActiveUserById(userId)

    // 查詢使用者所有角色綁定的菜單權限標識
    const roleHasPermissions = await Promise.all(
      user.roleIds.map(roleId => this.roleService.findRoleHasPermissions(roleId)),
    ).then(permissions => permissions.flat())

    // 檢查使用者是否擁有所需權限
    return roleHasPermissions.includes(permission)
  }
}

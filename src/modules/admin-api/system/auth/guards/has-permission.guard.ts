import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { HAS_PERMISSION_KEY } from '@/common/decorators/has-permission.decorator'
import { RoleService } from '@/modules/admin-api/system/role/role.service'

@Injectable()
export class HasPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 獲取路由上定義的權限標識
    const permission = this.reflector.get<string>(HAS_PERMISSION_KEY, context.getHandler())
    if (!permission) return true

    // 獲取使用者資訊
    const request = context.switchToHttp().getRequest()
    const user = request['user']

    // 查詢使用者所有角色綁定的選單權限標識
    const roleHasPermissions = await Promise.all(
      user.roleIds.map(roleId => this.roleService.findRoleHasPermissions(roleId)),
    ).then(permissions => permissions.flat())

    // 檢查使用者是否擁有所需權限
    return roleHasPermissions.includes(permission)
  }
}

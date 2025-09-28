import { UserModule } from './admin-api/system/user/user.module'
import { AuthModule } from './admin-api/system/auth/auth.module'
import { TokenBlacklistModule } from './admin-api/system/token-blacklist/token-blacklist.module'
import { RoleModule } from './admin-api/system/role/role.module'
import { UserRoleModule } from './admin-api/system/user-role/user-role.module'
import { MenuModule } from './admin-api/system/menu/menu.module'
import { DeptModule } from './admin-api/system/dept/dept.module'
import { RoleMenuModule } from './admin-api/system/role-menu/role-menu.module'
import { DictTypeModule } from './admin-api/system/dict-type/dict-type.module'
import { DictDataModule } from './admin-api/system/dict-data/dict-data.module'
import { MultilingualFieldsModule } from './admin-api/system/multilingual-fields/multilingual-fields.module'
import { VerifyCodeModule } from './admin-api/system/verify-code/verify-code.module'
import { LogModule } from './admin-api/system/log/log.module'

/**
 * 系統模組配置
 * 包含用戶管理、權限管理、系統配置等核心功能模組
 */
export const systemModules: any[] = [
  LogModule, // LogModule 一定要在其他模組之前引入
  UserModule,
  AuthModule,
  TokenBlacklistModule,
  RoleModule,
  UserRoleModule,
  MenuModule,
  RoleMenuModule,
  DeptModule,
  DictTypeModule,
  DictDataModule,
  MultilingualFieldsModule,
  VerifyCodeModule,
]

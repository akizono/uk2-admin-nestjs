import { UserModule } from './platform-api/system/user/user.module'
import { AuthModule } from './platform-api/system/auth/auth.module'
import { TokenBlacklistModule } from './platform-api/system/token-blacklist/token-blacklist.module'
import { RoleModule } from './platform-api/system/role/role.module'
import { UserRoleModule } from './platform-api/system/user-role/user-role.module'
import { MenuModule } from './platform-api/system/menu/menu.module'
import { DeptModule } from './platform-api/system/dept/dept.module'
import { RoleMenuModule } from './platform-api/system/role-menu/role-menu.module'
import { DictTypeModule } from './platform-api/system/dict-type/dict-type.module'
import { DictDataModule } from './platform-api/system/dict-data/dict-data.module'
import { MultilingualFieldsModule } from './platform-api/system/multilingual-fields/multilingual-fields.module'
import { VerifyCodeModule } from './platform-api/system/verify-code/verify-code.module'
import { LogModule } from './platform-api/system/log/log.module'

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

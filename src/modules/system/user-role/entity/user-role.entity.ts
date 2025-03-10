import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

import { UserEntity } from '@/modules/system/user/entity/user.entity'
import { RoleEntity } from '@/modules/system/role/entity/role.entity'
import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_user_role')
export class UserRoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ name: 'user_id', type: 'bigint', comment: '使用者ID' })
  userId: string

  @Column({ name: 'role_id', type: 'bigint', comment: '角色ID' })
  roleId: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity
}

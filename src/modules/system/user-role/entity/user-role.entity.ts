import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { UserEntity } from '@/modules/system/user/entity/user.entity'
import { RoleEntity } from '@/modules/system/role/entity/role.entity'

@Entity('system_user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: '主鍵ID',
  })
  id: string

  @Column({
    name: 'user_id',
    type: 'bigint',
    comment: '使用者ID',
  })
  userId: string

  @Column({
    name: 'role_id',
    type: 'bigint',
    comment: '角色ID',
  })
  roleId: string

  @Column({
    type: 'bigint',
    comment: '建立人',
  })
  creator: string

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '建立時間',
  })
  createTime: Date

  @Column({
    type: 'bigint',
    nullable: true,
    comment: '更新人',
  })
  updater: string

  @Column({
    name: 'update_time',
    type: 'datetime',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新時間',
  })
  updateTime: Date

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity
}

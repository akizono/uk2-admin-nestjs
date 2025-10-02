import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

import { RoleMenuEntity } from '@/modules/platform-api/system/role-menu/entity/role-menu.entity'
import { BaseEntity } from '@/common/entities/base.entity'
@Entity('system_role')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 50, comment: '角色代碼', unique: true })
  code: string

  @Column({ length: 50, comment: '角色名稱' })
  name: string

  @Column({ length: 255, comment: '角色描述', nullable: true })
  description: string

  @OneToMany(() => RoleMenuEntity, roleMenu => roleMenu.role)
  roleMenus: RoleMenuEntity[]

  @Column({ type: 'int', comment: '排序', default: 0 })
  sort: number
}

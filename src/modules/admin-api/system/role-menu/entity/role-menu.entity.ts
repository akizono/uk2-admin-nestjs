import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { RoleEntity } from '@/modules/admin-api/system/role/entity/role.entity'
import { MenuEntity } from '@/modules/admin-api/system/menu/entity/menu.entity'

@Entity('system_role_menu')
export class RoleMenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ name: 'role_id', type: 'bigint', comment: '角色ID' })
  roleId: string

  @Column({ name: 'menu_id', type: 'bigint', comment: '菜單ID' })
  menuId: string

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity

  @ManyToOne(() => MenuEntity)
  @JoinColumn({ name: 'menu_id' })
  menu: MenuEntity
}

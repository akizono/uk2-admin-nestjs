import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { RoleEntity } from '@/modules/system/role/entity/role.entity'
import { MenuEntity } from '@/modules/system/menu/entity/menu.entity'

@Entity('system_role_menu')
export class RoleMenuEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ name: 'role_id', type: 'bigint', comment: '角色ID' })
  roleId: string

  @Column({ name: 'menu_id', type: 'bigint', comment: '菜單ID' })
  menuId: string

  @Column({ type: 'bigint', comment: '建立人' })
  creator: string

  @Column({
    name: 'create_time',
    type: 'datetime',
    comment: '建立時間',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date

  @Column({ type: 'bigint', comment: '更新人', nullable: true })
  updater: string

  @Column({
    name: 'update_time',
    type: 'datetime',
    comment: '更新時間',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateTime: Date

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity

  @ManyToOne(() => MenuEntity)
  @JoinColumn({ name: 'menu_id' })
  menu: MenuEntity
}

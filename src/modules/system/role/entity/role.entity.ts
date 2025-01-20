import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('system_role')
export class RoleEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: '主鍵ID',
  })
  id: string

  @Column({
    length: 50,
    unique: true,
    comment: '角色代碼',
  })
  code: string

  @Column({
    length: 50,
    comment: '角色名稱',
  })
  name: string

  @Column({
    length: 255,
    nullable: true,
    comment: '角色描述',
  })
  description: string

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '狀態 0:禁用 1:啟用',
  })
  status: number

  @Column({
    name: 'is_deleted',
    type: 'tinyint',
    default: 0,
    comment: '是否刪除 0:否 1:是',
  })
  isDeleted: number

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
}

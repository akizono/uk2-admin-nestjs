import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('system_menu')
export class MenuEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 50, comment: '菜單名稱' })
  name: string

  @Column({ length: 100, comment: '菜單權限', nullable: true })
  permission: string

  @Column({ type: 'tinyint', comment: '菜單類型 0:目錄 1:菜單 2:按鈕' })
  type: number

  @Column({ type: 'int', comment: '排序' })
  sort: number

  @Column({ type: 'bigint', comment: '父級ID', nullable: true })
  parentId: string

  @Column({ type: 'tinyint', comment: '狀態 0:禁用 1:啟用', default: 1 })
  status: number

  @Column({
    name: 'is_deleted',
    type: 'tinyint',
    comment: '是否刪除 0:否 1:是',
    default: 0,
  })
  isDeleted: number

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
}

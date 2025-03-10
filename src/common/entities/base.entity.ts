import { Column } from 'typeorm'

export class BaseEntity {
  @Column({ length: 255, comment: '備註', nullable: true })
  remark: string

  @Column({ type: 'tinyint', comment: '狀態 0:禁用 1:啟用', default: 1 })
  status: number

  @Column({
    name: 'is_deleted',
    type: 'tinyint',
    comment: '是否刪除 0:否 1:是',
    default: 0,
  })
  isDeleted: number

  @Column({ type: 'bigint', comment: '建立人', nullable: true })
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

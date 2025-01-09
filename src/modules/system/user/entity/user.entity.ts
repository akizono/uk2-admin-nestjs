import { Entity, Column, Unique, PrimaryGeneratedColumn } from 'typeorm'

@Entity('system_user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Unique(['username'])
  @Column({ length: 55, comment: '帳號' })
  username: string

  @Column({ length: 64, comment: '密碼' })
  password: string

  @Column({ length: 32, nullable: true, comment: '鹽值' })
  salt: string

  @Column({ length: 55, nullable: true, comment: '暱稱' })
  nickname: string

  @Column({ type: 'tinyint', nullable: true, comment: '年齡' })
  age: number

  @Column({ length: 255, nullable: true, comment: '備註' })
  remark: string

  @Column({ length: 55, nullable: true, comment: '電子郵件' })
  email: string

  @Column({ length: 22, nullable: true, comment: '電話號碼' })
  mobile: string

  @Column({ type: 'tinyint', nullable: true, comment: '性別 1:男 2:女' })
  sex: number

  @Column({ length: 255, nullable: true, comment: '頭像' })
  avatar: string

  @Column({ type: 'tinyint', default: 1, comment: '狀態 0:禁用 1:啟用' })
  status: number

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0, comment: '是否刪除 0:否 1:是' })
  isDeleted: number

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '創建時間',
  })
  createTime: Date

  @Column({
    name: 'update_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新時間',
  })
  updateTime: Date
}

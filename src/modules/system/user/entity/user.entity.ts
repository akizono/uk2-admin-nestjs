import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { UserRoleEntity } from '@/modules/system/user-role/entity/user-role.entity'

@Entity('system_user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 55, comment: '帳號', unique: true })
  username: string

  @Column({ length: 64, comment: '密碼' })
  password: string

  @Column({ length: 32, comment: '鹽值', nullable: true })
  salt: string

  @Column({ length: 55, comment: '暱稱', nullable: true })
  nickname: string

  @Column({ type: 'tinyint', comment: '年齡', nullable: true })
  age: number

  @Column({ length: 255, comment: '備註', nullable: true })
  remark: string

  @Column({ length: 55, comment: '電子郵件', nullable: true })
  email: string

  @Column({ length: 55, comment: '電話號碼', nullable: true })
  mobile: string

  @Column({ type: 'tinyint', comment: '性別 1:男 2:女', nullable: true })
  sex: number

  @Column({ length: 255, comment: '頭像', nullable: true })
  avatar: string

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

  @OneToMany(() => UserRoleEntity, userRole => userRole.user)
  userRoles: UserRoleEntity[]
}

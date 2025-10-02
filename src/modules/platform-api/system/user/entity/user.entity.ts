import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'

import { UserRoleEntity } from '@/modules/platform-api/system/user-role/entity/user-role.entity'
import { DeptEntity } from '@/modules/platform-api/system/dept/entity/dept.entity'
import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_user')
export class UserEntity extends BaseEntity {
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

  @Column({ type: 'tinyint', comment: '性別 1:男 2:女', nullable: true })
  sex: number

  @Column({ length: 55, comment: '電子郵件', nullable: true })
  email: string

  @Column({ length: 55, comment: '手機號碼', nullable: true })
  mobile: string

  @Column({ length: 255, comment: '頭像', nullable: true })
  avatar: string

  @Column({ name: 'dept_id', type: 'bigint', comment: '部門ID', nullable: true })
  deptId: string

  @OneToMany(() => UserRoleEntity, userRole => userRole.user)
  userRoles: UserRoleEntity[]

  @ManyToOne(() => DeptEntity, dept => dept.users)
  @JoinColumn({ name: 'dept_id' })
  dept: DeptEntity
}

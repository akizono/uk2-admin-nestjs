import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { UserEntity } from '@/modules/admin-api/system/user/entity/user.entity'

@Entity('system_dept')
export class DeptEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ name: 'parent_id', type: 'bigint', comment: '父級ID', nullable: true })
  parentId: string

  @Column({ length: 50, comment: '部門名稱' })
  name: string

  @Column({ length: 50, comment: '部門代碼' })
  code: string

  @Column({ type: 'int', comment: '排序' })
  sort: number

  @Column({ name: 'leader_user_id', type: 'bigint', comment: '部門負責人ID' })
  leaderUserId: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'leader_user_id' })
  leaderUser: UserEntity

  @OneToMany(() => UserEntity, user => user.dept)
  users: UserEntity[]
}

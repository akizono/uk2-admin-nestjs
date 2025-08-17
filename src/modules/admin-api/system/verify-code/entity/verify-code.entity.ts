import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_verify_code')
export class VerifyCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 50, comment: '驗證碼' })
  code: string

  @Column({ length: 50, comment: '使用者id' })
  userId: string

  @Column({ length: 50, comment: '驗證碼類型: email / mobile' })
  type: string

  @Column({ length: 50, comment: '用戶信箱(type=email)', nullable: true })
  userEmail: string

  @Column({ length: 50, comment: '用戶手機(type=mobile)', nullable: true })
  userMobile: string

  @Column({ length: 50, comment: '使用場景（例如：retrieve-password）' })
  scene: string
}

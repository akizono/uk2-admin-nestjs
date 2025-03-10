import { Entity, Column, PrimaryColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_token_blacklist')
export class TokenBlacklistEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'jwt_id',
    type: 'varchar',
    length: 36,
    comment: 'JWT唯一標識符',
  })
  jwtId: string

  @Column({
    name: 'user_id',
    type: 'bigint',
    comment: '使用者ID',
  })
  userId: string

  @Column({
    type: 'varchar',
    length: 7,
    comment: '類型',
  })
  type: string

  @Column({
    name: 'expired_at',
    type: 'datetime',
    comment: '過期時間',
  })
  expiredAt: Date

  @Column({
    name: 'issued_at',
    type: 'datetime',
    comment: '發行時間',
  })
  issuedAt: Date
}

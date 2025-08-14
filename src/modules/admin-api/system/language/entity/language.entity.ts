import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_language')
export class LanguageEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 50, comment: '語言名稱' })
  name: string

  @Column({ length: 50, comment: '語言代碼' })
  code: string

  @Column({ type: 'int', comment: '排序', default: 0 })
  sort: number
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_multilingual_fields')
export class MultilingualFieldsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ name: 'fields_id', length: 50, comment: '對應欄位ID' })
  fieldId: string

  @Column({ length: 50, comment: '對應語言' })
  language: string

  @Column({ length: 50, comment: '欄位值' })
  value: string
}

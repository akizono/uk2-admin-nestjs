import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_dict_data')
export class DictDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 50, comment: '字典類型' })
  dictType: string

  @Column({ length: 50, comment: '字典標籤' })
  label: string

  @Column({ type: 'int', comment: '字典鍵值' })
  value: number

  @Column({ type: 'int', comment: '排序' })
  sort: number
}

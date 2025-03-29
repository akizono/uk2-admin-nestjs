import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_dict_data')
export class DictDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ type: 'bigint', comment: '字典類型ID' })
  dictTypeId: string

  @Column({ length: 50, comment: '字典標籤' })
  label: string

  @Column({ length: 50, comment: '字典鍵值' })
  value: string

  @Column({ type: 'int', comment: '排序' })
  sort: number
}

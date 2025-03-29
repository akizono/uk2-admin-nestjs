import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_dict_type')
export class DictTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 50, comment: '字典名稱' })
  name: string

  @Column({ length: 50, comment: '字典類型' })
  type: string

  @Column({ type: 'int', comment: '排序' })
  sort: number
}

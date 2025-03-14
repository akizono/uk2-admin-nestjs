import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_menu')
export class MenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ type: 'bigint', comment: '父級ID' })
  parentId: string

  @Column({ length: 50, comment: '菜單名稱' })
  name: string

  @Column({ length: 100, comment: '菜單權限', nullable: true })
  permission: string

  @Column({ type: 'tinyint', comment: '菜單類型 0:目錄 1:菜單 2:按鈕' })
  type: number

  @Column({ type: 'int', comment: '排序' })
  sort: number
}

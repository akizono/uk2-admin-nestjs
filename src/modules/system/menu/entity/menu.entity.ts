import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_menu')
export class MenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ type: 'bigint', comment: '父級ID', nullable: true })
  parentId: string

  @Column({ length: 50, comment: '菜單名稱' })
  name: string

  @Column({ length: 255, comment: '路由路徑', nullable: true })
  path: string

  @Column({ length: 255, comment: '元件路徑', nullable: true })
  component: string

  @Column({ length: 100, comment: '菜單權限' })
  permission: string

  @Column({ type: 'tinyint', comment: '菜單類型 0:目錄 1:菜單 2:按鈕' })
  type: number

  @Column({ length: 50, comment: '菜單圖標', nullable: true })
  icon: string

  @Column({ length: 255, comment: '外連地址', nullable: true })
  link: string

  @Column({ type: 'tinyint', comment: '是否緩存', default: 0 })
  isCache: number

  @Column({ type: 'tinyint', comment: '是否顯示在標籤', default: 0 })
  isShowTag: number

  @Column({ type: 'tinyint', comment: '是否常駐標籤欄', default: 0 })
  isKeepAlive: number

  @Column({ type: 'tinyint', comment: '是否顯示在側邊欄', default: 0 })
  isShowSide: number

  @Column({ type: 'int', comment: '排序', default: 0 })
  sort: number
}

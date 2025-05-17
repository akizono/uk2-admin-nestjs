import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_menu')
export class MenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ name: 'parent_id', type: 'bigint', comment: '父級ID', nullable: true })
  parentId: string

  @Column({ length: 50, comment: '選單名稱', nullable: true })
  name: string

  @Column({ length: 50, comment: '選單標題', nullable: true })
  title: string

  @Column({ length: 255, comment: '路由路徑', nullable: true })
  path: string

  @Column({ length: 255, comment: '元件路徑', nullable: true })
  component: string

  @Column({ length: 100, comment: '選單權限', nullable: true })
  permission: string

  @Column({ type: 'tinyint', comment: '選單類型 0:目錄 1:頁面 2:按鈕' })
  type: number

  @Column({ length: 50, comment: '選單圖示', nullable: true })
  icon: string

  @Column({ length: 255, comment: '外連地址', nullable: true })
  link: string

  @Column({ name: 'is_cache', type: 'tinyint', comment: '是否快取', default: 0 })
  isCache: number

  @Column({ name: 'is_show_tag', type: 'tinyint', comment: '是否顯示在標籤', default: 0 })
  isShowTab: number

  @Column({ name: 'is_persistent_tag', type: 'tinyint', comment: '是否常駐標籤欄位', default: 0 })
  isPersistentTab: number

  @Column({ name: 'is_show_side', type: 'tinyint', comment: '是否顯示在側邊欄', default: 0 })
  isShowSide: number

  @Column({ type: 'int', comment: '排序', default: 0 })
  sort: number
}

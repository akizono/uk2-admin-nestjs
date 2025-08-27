import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('system_log')
export class LogEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  // 介面資訊
  @Column({ comment: '介面路徑', nullable: true })
  path: string

  @Column({ comment: 'HTTP方法', length: 10, nullable: true })
  method: string

  // 請求資訊
  @Column({ type: 'json', comment: '請求參數', nullable: true })
  params: Record<string, any>

  @Column({ type: 'json', comment: '請求體數據', nullable: true })
  body: Record<string, any>

  @Column({ type: 'json', comment: '查詢參數', nullable: true })
  query: Record<string, any>

  // 響應資訊
  @Column({ type: 'int', comment: 'HTTP狀態碼', nullable: true })
  statusCode: number

  @Column({ type: 'int', comment: '反應時間（毫秒）', nullable: true })
  responseTime: number

  // 使用者資訊
  @Column({ type: 'bigint', comment: '使用者ID', nullable: true })
  userId: string

  @Column({ comment: '使用者IP位址', nullable: true })
  ip: string

  @Column({ comment: '使用者代理（瀏覽器資訊）', nullable: true })
  userAgent: string

  // 系統資訊
  @Column({ type: 'tinyint', comment: '是否操作成功(0: 失敗, 1: 成功)', nullable: true })
  isSuccess: number

  @Column({ type: 'text', comment: '錯誤資訊', nullable: true })
  errorMessage: string

  @Column({ type: 'text', comment: '錯誤堆棧', nullable: true })
  errorStack: string

  // 業務上下文
  @Column({ comment: '業務模組名', nullable: true })
  module: string

  @Column({ comment: '操作類型：CREATE/READ/UPDATE/DELETE', nullable: true })
  actionType: string

  // 新增欄位
  @Column({ comment: '操作名稱', nullable: true })
  operationName: string

  @Column({ comment: '資源ID', nullable: true })
  resourceId: string
}

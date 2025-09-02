import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('operations_script_execution_records')
export class ScriptExecutionRecordsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ type: 'varchar', comment: '腳本名稱' })
  name: string

  @Column({ type: 'varchar', comment: '腳本路徑' })
  path: string

  @Column({ type: 'text', comment: '執行結果' })
  result: string

  @Column({ type: 'text', comment: '錯誤資訊', nullable: true })
  error: string

  @Column({ type: 'int', comment: '退出代碼', nullable: true })
  exitCode: number

  @Column({ type: 'datetime', comment: '開始時間' })
  startTime: Date

  @Column({ type: 'datetime', comment: '結束時間' })
  endTime: Date

  @Column({ type: 'int', comment: '執行耗時(毫秒)' })
  duration: number

  @Column({ type: 'varchar', length: 50, comment: '執行環境/伺服器' })
  environment: string

  @Column({ type: 'varchar', length: 50, comment: '腳本類型: shell/python/js等' })
  type: string
}

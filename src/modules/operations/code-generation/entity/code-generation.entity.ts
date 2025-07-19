import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('operations_code_generation')
export class CodeGenerationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 50, comment: '名稱', nullable: true })
  name: string

  @Column({ length: 50, comment: '標識', nullable: true })
  code: string

  @Column({ type: 'tinyint', comment: '是否創建資料表', default: 0 })
  isGenerateTable: number

  @Column({ type: 'tinyint', comment: '是否生成後端代碼', default: 0 })
  isGenerateBackendCode: number

  @Column({ type: 'tinyint', comment: '是否生成前端代碼', default: 0 })
  isGenerateWebCode: number

  @Column({ type: 'tinyint', comment: '是否導入菜單和權限', default: 0 })
  isImportMenuAndPermission: number

  @Column({ type: 'int', comment: '排序', default: 0 })
  sort: number
}

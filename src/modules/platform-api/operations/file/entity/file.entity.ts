import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('operations_file')
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ type: 'uuid', comment: 'UUID' })
  uuid: string

  @Column({ length: 255, comment: '檔案名稱', nullable: true })
  name: string

  @Column({ length: 255, comment: '檔案路徑(FILE_STORAGE_PATH的相對路徑)' })
  path: string

  @Column({ length: 255, comment: '檔案URL' })
  url: string

  @Column({ length: 255, comment: '檔案類型' })
  type: string

  @Column({ type: 'int', comment: '檔案大小(kb)' })
  size: number
}

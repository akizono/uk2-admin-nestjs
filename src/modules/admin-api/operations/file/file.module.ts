import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

import { FileController } from './file.controller'
import { FileService } from './file.service'
import { FileEntity } from './entity/file.entity'

import { EnvHelper } from '@/utils/env-helper'

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // 使用環境變數中的檔案儲存路徑
          const fileStoragePath = EnvHelper.getString('FILE_STORAGE_PATH')
          cb(null, fileStoragePath)
        },
        filename: (req, file, cb) => {
          // 使用原始檔名，但可以根據需求進行修改
          cb(null, file.originalname)
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

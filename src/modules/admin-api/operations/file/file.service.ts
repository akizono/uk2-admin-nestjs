import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { FileEntity } from './entity/file.entity'
import { CreateFileReqDto, FindFileReqDto } from './dto/file.req.dto'

import { find, _delete } from '@/common/services/base.service'
import { EnvHelper } from '@/utils/env-helper'

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  // 上傳檔案（支援單個或多個檔案）
  async upload(filesData: { files: Express.Multer.File[] }) {
    const fileStoragePath = EnvHelper.getString('FILE_STORAGE_PATH')

    // 檢查檔案結構
    // console.log('Files data received:', filesData)

    // 取得實際的檔案陣列
    const files = filesData.files || []
    // console.log('Files array:', files)
    if (files.length > 0) {
      // console.log('First file structure:', JSON.stringify(files[0]))
    }

    // 如果沒有檔案，返回空陣列
    if (files.length === 0) {
      return { files: [] }
    }

    // 儲存檔案到本地並建立資料庫記錄
    const savedFiles = await Promise.all(files.map(file => this.saveFile(file, fileStoragePath)))

    // 返回完整的檔案資料
    return {
      files: savedFiles,
    }
  }

  // 新增檔案
  async create(createFileReqDtoList: CreateFileReqDto) {
    const { files } = createFileReqDtoList
    const savedFiles = await Promise.all(
      files.map(fileDto => {
        const fileEntity = this.fileRepository.create(fileDto)
        return this.fileRepository.save(fileEntity)
      }),
    )
    return { ids: savedFiles.map(file => file.id) }
  }

  // 儲存檔案到本地並建立資料庫記錄
  private async saveFile(file: Express.Multer.File, fileStoragePath: string) {
    // 檢查檔案結構
    // console.log('Saving file:', file)
    // console.log('File keys:', Object.keys(file))

    // 確保儲存目錄存在
    if (!fs.existsSync(fileStoragePath)) {
      fs.mkdirSync(fileStoragePath, { recursive: true })
    }

    // 生成唯一檔案名稱
    const fileExtension = path.extname(file.originalname || '') // 副檔名
    const fileName = `${uuidv4()}${fileExtension}` // 使用 「uuid + 副檔名」 作為 path 中的檔案名稱
    const relativePath = `./${fileName}` // 相對路徑
    const filePath = path.join(fileStoragePath, fileName) // 檔案的完整路徑

    // 寫入檔案
    if (!file.buffer && file.path) {
      // 如果沒有 buffer 但有臨時檔案路徑，則讀取臨時檔案
      const fileContent = fs.readFileSync(file.path)
      fs.writeFileSync(filePath, fileContent)
    } else if (file.buffer) {
      // 如果有 buffer，直接使用
      fs.writeFileSync(filePath, file.buffer)
    } else {
      throw new Error('No file content available')
    }

    // 建立檔案記錄
    const fileEntity = this.fileRepository.create({
      name: file.originalname || null,
      path: relativePath,
      url: `/${fileName}`,
      type: file.mimetype || 'application/octet-stream',
      size: Math.round((file.size || 0) / 1024), // 轉換為KB
    })

    // 儲存到資料庫
    return this.fileRepository.save(fileEntity)
  }

  // 查詢檔案
  async find(findFileReqDto: FindFileReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findFileReqDto,
      repository: this.fileRepository,
      where: {
        isDeleted: 0,
        status: 1,
      },
    })

    return {
      total,
      list,
    }
  }

  // 刪除檔案
  async delete(id: string) {
    await _delete({
      id,
      repository: this.fileRepository,
      modalName: '檔案',
    })
  }
}

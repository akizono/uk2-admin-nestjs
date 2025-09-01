import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as fs from 'fs/promises'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { FileEntity } from './entity/file.entity'
import { FindFileReqDto } from './dto/file.req.dto'

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
    // if (files.length > 0) {
    // console.log('First file structure:', JSON.stringify(files[0]))
    // }

    // 如果沒有檔案，返回空陣列
    if (files.length === 0) {
      return { files: [] }
    }

    // 檢查是否有檔案大小超過限制
    const maxFileSize = eval(EnvHelper.getString('MAX_FILE_SIZE'))
    const oversizedFile = files.find(file => file.size > maxFileSize)
    if (oversizedFile) {
      // 解決中文檔案名稱編碼問題
      const originalName = oversizedFile.originalname
        ? Buffer.from(oversizedFile.originalname, 'latin1').toString('utf8')
        : ''
      const fileName = originalName || oversizedFile.originalname || '未命名檔案'

      const errorMessage = `檔案 "${fileName}" 大小為 ${Math.round((oversizedFile.size / 1024 / 1024) * 100) / 100} MB，超過了 ${maxFileSize / (1024 * 1024)} MB 的限制`
      throw new BadRequestException(errorMessage)
    }

    // 所有檔案都符合大小要求
    const validFiles = files

    // 儲存有效的檔案到本地並建立資料庫記錄
    const savedFiles = await Promise.all(validFiles.map(file => this.saveFile(file, fileStoragePath)))

    // 返回完整的檔案資料
    const urlPrefix = EnvHelper.getString('FILE_SERVE_BASE_URL') + EnvHelper.getString('FILE_SERVE_ACCESS_PATH')
    return {
      files: savedFiles.map(file => ({
        ...file,
        url: urlPrefix + file.url,
      })),
    }
  }

  // 儲存檔案到本地並建立資料庫記錄
  private async saveFile(file: Express.Multer.File, fileStoragePath: string) {
    // 檢查檔案結構
    // console.log('Saving file:', file)
    // console.log('File keys:', Object.keys(file))

    // 確保儲存目錄存在
    try {
      await fs.access(fileStoragePath)
    } catch {
      // 目錄不存在，創建它
      await fs.mkdir(fileStoragePath, { recursive: true })
    }

    // 解決中文檔案名稱編碼問題
    const originalName = file.originalname ? Buffer.from(file.originalname, 'latin1').toString('utf8') : ''
    // console.log('Original filename:', file.originalname)
    // console.log('Decoded filename:', originalName)

    // 生成唯一檔案名稱
    const fileExtension = path.extname(originalName) // 副檔名
    const fileName = `${uuidv4()}${fileExtension}` // 使用 「uuid + 副檔名」 作為 path 中的檔案名稱
    const relativePath = `./${fileName}` // 相對路徑
    const filePath = path.join(fileStoragePath, fileName) // 檔案的完整路徑

    // 寫入檔案
    if (!file.buffer && file.path) {
      // 如果沒有 buffer 但有臨時檔案路徑，則讀取臨時檔案
      const fileContent = await fs.readFile(file.path)
      await fs.writeFile(filePath, fileContent)
    } else if (file.buffer) {
      // 如果有 buffer，直接使用
      await fs.writeFile(filePath, file.buffer)
    } else {
      throw new Error('No file content available')
    }

    // 建立檔案記錄
    const fileEntity = this.fileRepository.create({
      name: originalName || null,
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
      list: list.map(item => {
        const urlPrefix = EnvHelper.getString('FILE_SERVE_BASE_URL') + EnvHelper.getString('FILE_SERVE_ACCESS_PATH')
        return {
          ...item,
          url: urlPrefix + item.url,
        }
      }),
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

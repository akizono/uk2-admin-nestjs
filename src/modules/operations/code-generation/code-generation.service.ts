import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { HttpException, HttpStatus } from '@nestjs/common'

import { CodeGenerationEntity } from './entity/code-generation.entity'
import {
  CreateCodeGenerationReqDto,
  FindCodeGenerationReqDto,
  PreviewEntityCodeReqDto,
  InsertEntityCodeReqDto,
  UpdateCodeGenerationReqDto,
} from './dto/code-generation.req.dto'

import { StrGenerator } from '@/utils/str-generator'
import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class CodeGenerationService {
  constructor(
    @InjectRepository(CodeGenerationEntity)
    private readonly codeGenerationRepository: Repository<CodeGenerationEntity>,
  ) {}

  // 新增
  async create(createCodeGenerationReqDto: CreateCodeGenerationReqDto) {
    const result = await create({
      dto: createCodeGenerationReqDto,
      repository: this.codeGenerationRepository,
      modalName: '模組',
    })

    return { id: result.id }
  }

  // 查詢
  async find(findCodeGenerationReqDto: FindCodeGenerationReqDto) {
    // 查詢選單
    const { list, total } = await find({
      dto: findCodeGenerationReqDto,
      repository: this.codeGenerationRepository,
      where: {
        isDeleted: 0,
      },
    })

    return {
      total,
      list,
    }
  }

  // 更新
  async update(updateCodeGenerationReqDto: UpdateCodeGenerationReqDto) {
    await update({
      dto: updateCodeGenerationReqDto,
      repository: this.codeGenerationRepository,
      existenceCondition: ['id'],
      repeatCondition: ['code'],
      modalName: '模組',
    })
  }

  // 刪除
  async delete(id: string) {
    await _delete({
      id,
      repository: this.codeGenerationRepository,
      modalName: '模組',
    })
  }

  // 封鎖
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.codeGenerationRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })
  }

  // 解封鎖
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.codeGenerationRepository,
      existenceCondition: ['id'],
      modalName: '選單',
    })
  }

  async generateEntityCode(previewEntityCodeReqDto: PreviewEntityCodeReqDto) {
    await new Promise((resolve, reject) => {
      const jsonInput = JSON.stringify(previewEntityCodeReqDto)
      const plop = spawn('npx', ['plop', 'entity'], { stdio: 'pipe' })

      // 設置超時（例如10秒）
      const timeout = setTimeout(() => {
        plop.kill() // 終止進程
        reject(new Error('操作超時：未收到預期的JSON配置提示'))
      }, 10000)

      // 監聽 plop 的輸出
      let receivedPrompt = false
      plop.stdout.on('data', data => {
        const output = data.toString()

        // 更靈活的提示檢測（不區分大小寫，包含關鍵字即可）
        if (!receivedPrompt && output.includes('hint::請輸入JSON配置::')) {
          receivedPrompt = true
          clearTimeout(timeout) // 取消超時

          // 等待1000毫秒後再輸入
          setTimeout(() => {
            plop.stdin.write(jsonInput + '\n')
          }, 1000)
        }
      })

      // 監聽 plop 的錯誤輸出
      // plop.stderr.on('data', data => {
      //   console.error(`stderr: ${data}`)
      // })

      plop.on('close', code => {
        clearTimeout(timeout) // 確保清除定時器
        if (code === 0) {
          resolve('執行成功')
        } else {
          console.error('❌ Plop 執行失敗')
          reject(new Error('Plop 執行失敗'))
        }
      })

      plop.on('error', err => {
        clearTimeout(timeout) // 確保清除定時器
        console.error('❌ 執行出錯:', err)
        reject(err)
      })
    })

    const filePath = path.join(
      __dirname,
      `../../../../plop-templates/.cache/${previewEntityCodeReqDto.fileName}-${previewEntityCodeReqDto.timestamp}`,
    )
    // 讀取文件
    const entityCode =
      (
        await new Promise<string>((resolve, reject) => {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
              console.error('讀取文件失敗:', err)
              reject(err)
            } else {
              resolve(data)
            }
          })
        })
      )
        .match(/<entity>([\s\S]*?)<\/entity>/)[1]
        .trim() + '\n'

    // 刪除文件
    await fs.promises.unlink(filePath)

    return entityCode
  }

  // 返回 EntityCode 預覽
  async previewEntityCode(previewEntityCodeReqDto: PreviewEntityCodeReqDto) {
    const entityCode = await this.generateEntityCode(previewEntityCodeReqDto)

    /** 生成代碼預覽頁面的文件數 */
    const treeData = [
      {
        label: 'src',
        key: StrGenerator.generateAlphanumeric(8),
        type: 'folder',
        children: [
          {
            label: 'modules',
            key: StrGenerator.generateAlphanumeric(8),
            type: 'folder',
            children: [
              {
                label: previewEntityCodeReqDto.splitName[0],
                key: StrGenerator.generateAlphanumeric(8),
                type: 'folder',
                children: [
                  {
                    label: previewEntityCodeReqDto.splitName[1],
                    key: StrGenerator.generateAlphanumeric(8),
                    type: 'folder',
                    children: [
                      {
                        label: 'entity',
                        key: StrGenerator.generateAlphanumeric(8),
                        type: 'folder',
                        children: [
                          {
                            label: `${previewEntityCodeReqDto.fileName}.entity.ts`,
                            key: StrGenerator.generateAlphanumeric(8),
                            type: 'file',
                            code: entityCode,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    return {
      treeData,
    }
  }

  // 插入 EntityCode
  async insertEntityCode(insertEntityCodeReqDto: InsertEntityCodeReqDto) {
    const { splitName, fileName } = insertEntityCodeReqDto

    const entityCode = await this.generateEntityCode(insertEntityCodeReqDto)

    // 根目錄
    const rootDir = process.cwd()
    // 文件指定路徑
    const filePath = path.join(rootDir, 'src/modules', splitName[0], splitName[1], 'entity', `${fileName}.entity.ts`)

    try {
      // 檢查文件是否存在
      await fs.promises.access(filePath)
      throw new HttpException('文件已存在', HttpStatus.BAD_REQUEST)
    } catch (error) {
      // 如果錯誤是 HttpException，則繼續拋出
      if (error instanceof HttpException) {
        throw error
      }

      // 文件不存在，繼續執行創建操作
      try {
        // 修改本模組的isGenerateEntity為1
        await this.codeGenerationRepository.update({ code: fileName }, { isGenerateEntity: 1 })

        // 確保目錄存在
        const dirPath = path.dirname(filePath)
        await fs.promises.mkdir(dirPath, { recursive: true })

        // 使用非同步寫入
        await fs.promises.writeFile(filePath, entityCode)
      } catch (error) {
        console.error('創建文件時發生錯誤：', error)
        throw new Error(`文件創建失敗: ${error.message}`)
      }
    }
  }
}

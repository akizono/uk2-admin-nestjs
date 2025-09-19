import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'

import { MultilingualFieldsEntity } from '@/modules/admin-api/system/multilingual-fields/entity/multilingual-fields.entity'
import { fillNonEmptyWithDefaults } from '@/utils/entity-utils'

interface CreateParams {
  dto: Record<string, any> // 後端接收的參數
  repository: Repository<any> // 資料庫操作的 Repository
  repeatCondition?: string[] // 查詢是否有重複的數據
  modalName: string // 模組名稱

  /**
   * 需要進行外鍵檢查的條件
   * 沒有這個參數不影響運行，只是無法將「外鍵」不存在時的錯誤訊息返回前端
   * 通常還是建議加上
   */
  foreignKeyChecks?: Array<{
    field: string // 外鍵欄位
    repository: Repository<any> // 關聯表的 Repository
    modalName: string // 關聯表的模組名稱
  }>
}

interface FindParams {
  dto: Record<string, any>
  repository: Repository<any>
  relations?: string[] // 需要進行關聯查詢的欄位
  where?: Record<string, any> // 需要進行查詢的條件
}

interface FindOneParams {
  id: string
  repository: Repository<any>
  relations?: string[] // 需要進行關聯查詢的欄位
  where?: Record<string, any> // 需要進行查詢的條件
}

interface UpdateParams {
  dto: Record<string, any>
  repository: Repository<any>
  existenceCondition?: string[] // 需要進行存在性判斷的條件
  repeatCondition?: string[] // 需要進行重複性判斷的條件
  modalName: string
}

interface DeleteParams {
  id: string
  repository: Repository<any>
  modalName: string
}

export async function create(params: CreateParams) {
  try {
    const { repository, repeatCondition = [], modalName, foreignKeyChecks = [] } = params
    const dto = fillNonEmptyWithDefaults(params.dto, repository)

    // 檢查外鍵是否存在
    for (const check of foreignKeyChecks) {
      const exist = await check.repository.findOne({
        where: { id: dto[check.field] },
      })
      if (!exist) {
        throw new NotFoundException(`${check.modalName}不存在`)
      }
    }

    if (repeatCondition.length > 0) {
      const whereFields = repeatCondition.reduce((acc, field) => {
        acc[field] = dto[field]
        return acc
      }, {})
      const exist = await repository.findOne({ where: whereFields })
      if (exist) throw new ConflictException(`${modalName}已存在`)
    }

    let newData
    try {
      newData = repository.create(dto)
    } catch (error) {
      throw new BadRequestException(`建立${modalName}失敗：${error.message}`)
    }

    try {
      await repository.save(newData)
    } catch (error) {
      throw new BadRequestException(`儲存${modalName}失敗：${error.message}`)
    }

    return newData
  } catch (error) {
    throw error
  }
}

export async function find(params: FindParams) {
  try {
    // 解構參數
    const { dto, repository, relations = [], where } = params
    // 解構DTO
    const { pageSize, currentPage, ...remain } = fillNonEmptyWithDefaults(dto, repository)
    // 組裝查詢條件
    const conditions = Object.keys(remain).length > 0 ? remain : undefined
    const skip = pageSize === 0 ? undefined : (currentPage - 1) * pageSize
    const take = pageSize === 0 ? undefined : pageSize

    // 注入 MultilingualFieldsEntity
    const multilingualFieldsRepository = repository.manager.getRepository(MultilingualFieldsEntity)

    // 如果有多語言欄位，則需要獲取語言在multilingual-fields資料庫中的id
    const fieldIds = {}
    if (dto.multilingualFields && Array.isArray(dto.multilingualFields) && dto.multilingualFields.length > 0) {
      const mfKeys = dto.multilingualFields
      for (let index = 0; index < mfKeys.length; index++) {
        const key = mfKeys[index]
        if (conditions && conditions[key]) {
          // 在 multilingual-fields 資料庫中進行尋找
          const value = conditions[key]
          fieldIds[key] = (
            await multilingualFieldsRepository.find({
              where: {
                value,
                isDeleted: 0,
                status: 1,
              },
            })
          ).map(item => item.fieldId)
        }
      }
    }

    // 查詢資料
    let list = []
    let total = 0
    // 「需要適配多語言的查詢參數」的尋找
    if (Object.keys(fieldIds).length > 0) {
      const fieldKeys = Object.keys(fieldIds)

      // 計算所有可能的組合（笛卡兒積）
      const generateCombinations = arrays => {
        if (arrays.length === 0) return [[]]
        if (arrays.length === 1) return arrays[0].map(item => [item])

        const result = []
        const restCombinations = generateCombinations(arrays.slice(1))

        for (const item of arrays[0]) {
          for (const combination of restCombinations) {
            result.push([item, ...combination])
          }
        }

        return result
      }

      const fieldValueArrays = fieldKeys.map(key => fieldIds[key])
      const combinations = generateCombinations(fieldValueArrays)

      // 將組合轉換為查詢條件對象
      const queryCombinations = combinations.map(combination => {
        const queryObj = {}
        fieldKeys.forEach((key, index) => {
          queryObj[key] = combination[index]
        })
        return queryObj
      })

      // 使用每個組合進行查詢（不應用分頁，先查出所有結果）
      const allResults = []
      for (const combination of queryCombinations) {
        const result = await repository.find({
          relations,
          where: {
            ...where,
            ...conditions,
            ...combination,
          },
        })
        allResults.push(...result)
      }

      // 去重（根據id）
      const uniqueItems = allResults.filter((item, index, self) => index === self.findIndex(t => t.id === item.id))

      // 設定總數
      total = uniqueItems.length

      // 應用分頁
      if (pageSize > 0) {
        const startIndex = (currentPage - 1) * pageSize
        list = uniqueItems.slice(startIndex, startIndex + pageSize)
      } else {
        list = uniqueItems
      }
    }

    // 「不需要適配多語言的查詢參數」的尋找
    else {
      const result = await repository.findAndCount({
        relations,
        where: {
          ...conditions,
          ...where,
        },
        skip,
        take,
      })
      list = result[0]
      total = result[1]
    }

    /** 在 list 的返回值中攜帶「多語言欄位」的具體數據  */
    // 檢查是否存在「多語言欄位」
    const multilingualFields = []
    outerLoop: for (let i = 0; i < list.length; i++) {
      const item = list[i]
      for (const key in item) {
        if (
          item[key] !== null &&
          item[key] !== undefined &&
          typeof item[key] === 'string' &&
          item[key].startsWith('multilingual-')
        ) {
          multilingualFields.push(key)
          break outerLoop
        }
      }
    }
    // 根據multilingualFields，查詢list中每條資料的多語言欄位
    if (multilingualFields.length > 0) {
      // 使用 Promise.all 等待所有操作完成
      await Promise.all(
        list.map(async item => {
          await Promise.all(
            multilingualFields.map(async field => {
              const data = await multilingualFieldsRepository.find({
                where: {
                  fieldId: item[field],
                  isDeleted: 0,
                  status: 1,
                },
              })
              // 將多語言資訊一併返回
              if (!item['multilingualFields']) item['multilingualFields'] = {}
              item['multilingualFields'][field] = data
            }),
          )
        }),
      )
    }

    return {
      list,
      total,
    }
  } catch (error) {
    throw error
  }
}

export async function findOne(params: FindOneParams) {
  try {
    const { id, repository, relations = [], where } = params

    // 注入 MultilingualFieldsEntity
    const multilingualFieldsRepository = repository.manager.getRepository(MultilingualFieldsEntity)

    // 查詢單一資料
    const item = await repository.findOne({
      where: {
        id,
        ...where,
      },
      relations,
    })

    if (!item) {
      return null
    }

    /** 在返回值中攜帶「多語言欄位」的具體數據  */
    // 檢查是否存在「多語言欄位」
    const multilingualFields = []
    for (const key in item) {
      if (
        item[key] !== null &&
        item[key] !== undefined &&
        typeof item[key] === 'string' &&
        item[key].startsWith('multilingual-')
      ) {
        multilingualFields.push(key)
      }
    }

    // 根據multilingualFields，查詢多語言欄位
    if (multilingualFields.length > 0) {
      await Promise.all(
        multilingualFields.map(async field => {
          const data = await multilingualFieldsRepository.find({
            where: {
              fieldId: item[field],
              isDeleted: 0,
              status: 1,
            },
          })
          // 將多語言資訊一併返回
          if (!item['multilingualFields']) item['multilingualFields'] = {}
          item['multilingualFields'][field] = data
        }),
      )
    }

    return item
  } catch (error) {
    throw error
  }
}

export async function update(params: UpdateParams) {
  try {
    const { dto, repository, existenceCondition, repeatCondition, modalName } = params
    const { id, ...remain } = fillNonEmptyWithDefaults(dto, repository)

    if (id && remain.parentId && id === remain.parentId) {
      throw new BadRequestException('不能將自己設為父級')
    }

    if (existenceCondition && existenceCondition.length > 0) {
      const whereFields = existenceCondition.reduce((acc, field) => {
        acc[field] = dto[field]
        return acc
      }, {})
      const exist = await repository.findOne({ where: whereFields })
      if (!exist) throw new NotFoundException(`${modalName}不存在`)
    }

    if (repeatCondition && repeatCondition.length > 0) {
      const whereFields = repeatCondition.reduce((acc, field) => {
        acc[field] = dto[field]
        return acc
      }, {})
      const exist = await repository.findOne({ where: whereFields })
      if (exist && exist.id !== id) {
        throw new ConflictException(`[${repeatCondition.join('、')}]已存在`)
      }
    }

    await repository.update({ id }, remain)
  } catch (error) {
    throw error
  }
}

export async function _delete(params: DeleteParams) {
  try {
    const { id, repository, modalName } = params

    // 檢查是否存在
    const exist = await repository.findOne({ where: { id } })
    if (!exist) throw new NotFoundException(`${modalName}不存在`)

    // 檢查表是否有 parentId 欄位
    const hasParentIdColumn = repository.manager.connection
      .getMetadata(repository.target)
      .hasColumnWithPropertyPath('parentId')

    // 只有在表有 parentId 欄位時才檢查子項
    if (hasParentIdColumn) {
      const childs = await repository.findOne({
        where: {
          parentId: id,
          isDeleted: 0,
        },
      })
      if (childs && childs.length > 0) {
        throw new BadRequestException(`${modalName}下存在子項，無法刪除`)
      }
    }

    await repository.update({ id }, { isDeleted: 1 })
  } catch (error) {
    throw error
  }
}

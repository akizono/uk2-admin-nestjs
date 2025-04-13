import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'

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

interface UpdateParams {
  dto: Record<string, any>
  repository: Repository<any>
  existenceCondition?: string[]
  repeatCondition?: string[]
  modalName: string
}

interface DeleteParams {
  id: string
  repository: Repository<any>
  modalName: string
}

export async function create(params: CreateParams) {
  try {
    const { dto, repository, repeatCondition = [], modalName, foreignKeyChecks = [] } = params

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
    const { dto, repository, relations = [], where } = params

    const { pageSize, currentPage, ...remain } = dto

    const conditions = Object.keys(remain).length > 0 ? remain : undefined
    const skip = pageSize === 0 ? undefined : (currentPage - 1) * pageSize
    const take = pageSize === 0 ? undefined : pageSize

    const [list, total] = await repository.findAndCount({
      relations,
      where: {
        ...conditions,
        ...where,
      },
      skip,
      take,
    })

    return {
      list,
      total,
    }
  } catch (error) {
    throw error
  }
}

export async function update(params: UpdateParams) {
  try {
    const { dto, repository, existenceCondition, repeatCondition, modalName } = params

    const { id, ...remain } = dto

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
      if (exist) throw new ConflictException(`[${repeatCondition.join('、')}]已存在`)
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

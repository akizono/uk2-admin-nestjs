import { ConflictException } from '@nestjs/common'
import { Repository } from 'typeorm'

interface CreateParams {
  dto: Record<string, any>
  repository: Repository<any>
  existenceCondition?: string[]
  modalName: string
}

export async function create(params: CreateParams) {
  try {
    const { dto, repository, existenceCondition = [], modalName } = params

    if (existenceCondition.length > 0) {
      const whereFields = existenceCondition.map(field => ({ [field]: dto[field] }))
      const exist = await repository.findOne({ where: whereFields })
      if (exist) throw new ConflictException(`${modalName}已存在`)
    }

    const newData = repository.create(dto)
    await repository.save(newData)
    return newData
  } catch (error) {
    throw error
  }
}

interface FindParams {
  dto: Record<string, any>
  repository: Repository<any>
  relations?: string[]
  where?: Record<string, any>
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

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DeptEntity } from './entity/dept.entity'
import { CreateDeptReqDto, FindDeptReqDto, UpdateDeptReqDto } from './dto/dept.req.dto'

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepository: Repository<DeptEntity>,
  ) {}

  // 新增部門
  async create(createDeptReqDto: CreateDeptReqDto) {
    const newDept = this.deptRepository.create(createDeptReqDto)
    await this.deptRepository.save(newDept)
    return {
      id: newDept.id,
    }
  }

  // 查詢部門
  async find(findDeptReqDto: FindDeptReqDto) {
    const { pageSize, currentPage, ...remain } = findDeptReqDto

    const conditions = Object.keys(remain).length > 0 ? remain : undefined
    const skip = pageSize === 0 ? undefined : (currentPage - 1) * pageSize
    const take = pageSize === 0 ? undefined : pageSize

    const [depts, total] = await this.deptRepository.findAndCount({
      relations: ['leaderUser'],
      where: {
        isDeleted: 0,
        ...conditions,
      },
      skip,
      take,
    })

    // 如果 leaderUser 存在則去除password
    depts.forEach(dept => {
      if (dept.leaderUser) delete dept.leaderUser['password']
    })

    return {
      total,
      list: depts,
    }
  }

  // 更新部門
  async update(updateDeptReqDto: UpdateDeptReqDto) {
    const { id, ...remain } = updateDeptReqDto

    const existDept = await this.deptRepository.findOne({ where: { id } })
    if (!existDept) throw new NotFoundException('部門不存在')

    await this.deptRepository.update({ id }, remain)
  }

  // 刪除部門
  async delete(id: string) {
    const existDept = await this.deptRepository.findOne({ where: { id } })
    if (!existDept) throw new NotFoundException('部門不存在')

    // 檢查是否存在子部門
    const childDept = await this.deptRepository.findOne({
      where: {
        parentId: id,
        isDeleted: 0,
      },
    })

    if (childDept) {
      throw new BadRequestException('該部門下存在子部門，無法刪除')
    }

    await this.deptRepository.update({ id }, { isDeleted: 1 })
  }

  // 封鎖部門
  async block(id: string) {
    const existDept = await this.deptRepository.findOne({ where: { id } })
    if (!existDept) throw new NotFoundException('部門不存在')

    await this.deptRepository.update({ id }, { status: 0 })
  }

  // 解封鎖部門
  async unblock(id: string) {
    const existDept = await this.deptRepository.findOne({ where: { id } })
    if (!existDept) throw new NotFoundException('部門不存在')

    await this.deptRepository.update({ id }, { status: 1 })
  }
}

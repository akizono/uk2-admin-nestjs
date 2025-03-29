import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DeptEntity } from './entity/dept.entity'
import { CreateDeptReqDto, FindDeptReqDto, UpdateDeptReqDto } from './dto/dept.req.dto'

import { create, find, update, _delete } from '@/common/services/base.service'

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepository: Repository<DeptEntity>,
  ) {}

  // 新增部門
  async create(createDeptReqDto: CreateDeptReqDto) {
    const result = await create({
      dto: createDeptReqDto,
      repository: this.deptRepository,
      modalName: '部門',
    })

    return { id: result.id }
  }

  // 查詢部門
  async find(findDeptReqDto: FindDeptReqDto) {
    const { list, total } = await find({
      dto: findDeptReqDto,
      repository: this.deptRepository,
      relations: ['leaderUser'],
      where: {
        isDeleted: 0,
      },
    })

    // 如果存在leaderUser這個欄位，則去除password
    list.forEach(item => {
      if (item.leaderUser) delete item.leaderUser['password']
    })

    return {
      total,
      list,
    }
  }

  // 更新部門
  async update(updateDeptReqDto: UpdateDeptReqDto) {
    await update({
      dto: updateDeptReqDto,
      repository: this.deptRepository,
      existenceCondition: ['id'],
      modalName: '部門',
    })
  }

  // 刪除部門
  async delete(id: string) {
    await _delete({
      id,
      repository: this.deptRepository,
      modalName: '部門',
    })
  }

  // 封鎖部門
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.deptRepository,
      existenceCondition: ['id'],
      modalName: '部門',
    })
  }

  // 解封鎖部門
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.deptRepository,
      existenceCondition: ['id'],
      modalName: '部門',
    })
  }
}

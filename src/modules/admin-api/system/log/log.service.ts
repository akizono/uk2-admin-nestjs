import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MultilingualFieldsEntity } from '../multilingual-fields/entity/multilingual-fields.entity'
import { UserEntity } from '../user/entity/user.entity'

import { LogEntity } from './entity/log.entity'
import { CreateLogReqDto, FindLogReqDto } from './dto/log.req.dto'

import { create } from '@/common/services/base.service'

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MultilingualFieldsEntity)
    private readonly multilingualFieldsRepository: Repository<MultilingualFieldsEntity>,
  ) {}

  // 新增日誌
  async create(createLogReqDto: CreateLogReqDto) {
    await create({
      dto: createLogReqDto,
      repository: this.logRepository,
      modalName: '日誌',
    })
  }

  // 查詢日誌
  async find(findLogReqDto: FindLogReqDto) {
    const { pageSize = 10, currentPage = 1, ...remain } = findLogReqDto

    const conditions = Object.keys(remain).length > 0 ? remain : undefined
    const skip = pageSize === 0 ? undefined : (currentPage - 1) * pageSize
    const take = pageSize === 0 ? undefined : pageSize

    // 使用 queryBuilder 來包含用戶詳細資訊
    const queryBuilder = this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect('user.dept', 'dept')
      .where('log.isDeleted = :isDeleted', { isDeleted: 0 })

    // 添加其他篩選條件
    if (conditions) {
      Object.keys(conditions).forEach(key => {
        queryBuilder.andWhere(`log.${key} = :${key}`, { [key]: conditions[key] })
      })
    }

    // 分頁處理
    if (skip !== undefined) {
      queryBuilder.skip(skip)
    }
    if (take !== undefined) {
      queryBuilder.take(take)
    }

    // 排序（按創建時間正序，從舊到新）
    queryBuilder.orderBy('log.createTime', 'ASC')

    const logs = await queryBuilder.getMany()
    const total = await queryBuilder.getCount()

    // 處理返回數據，包含用戶詳細資訊
    const list = await Promise.all(
      logs.map(async log => {
        const { user, ...logData } = log

        let userData = null
        if (user) {
          const { userRoles, ...userRemain } = user
          // 不顯示密碼相關資訊
          delete userRemain.password
          delete userRemain.salt

          /* 如果「部門」存在，則需要將「部門名稱」和「部門名稱的多語言欄位」一併返回 */
          if (userRemain.dept) {
            // 如果「multilingualFields」不存在，則需要初始化
            if (!userRemain['multilingualFields']) {
              userRemain['multilingualFields'] = {}
            }
            userRemain['deptName'] = userRemain.dept.name
            userRemain['multilingualFields']['deptName'] = await this.multilingualFieldsRepository.find({
              where: {
                fieldId: userRemain.dept.name,
                isDeleted: 0,
              },
            })
          }

          userData = {
            ...userRemain,
            role: userRoles?.map(item => item.role.code),
            roleIds: userRoles?.map(item => item.role.id),
            roleNames: userRoles?.map(item => item.role.name),
          }
        }

        return {
          ...logData,
          user: userData,
        }
      }),
    )

    return {
      total,
      list,
    }
  }

  // 日誌沒有刪除、更新功能
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MultilingualFieldsEntity } from '../multilingual-fields/entity/multilingual-fields.entity'

import { UserEntity } from './entity/user.entity'
import { CreateUserReqDto, FindUserReqDto, UpdateUserReqDto } from './dto/user.req.dto'

import { encryptPassword } from '@/utils/crypto'
import { create } from '@/common/services/base.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MultilingualFieldsEntity)
    private readonly multilingualFieldsRepository: Repository<MultilingualFieldsEntity>,
  ) {}

  async create(createUserReqDto: CreateUserReqDto) {
    const { hashedPassword, salt } = encryptPassword(createUserReqDto.password)
    const result = await create({
      dto: {
        ...createUserReqDto,
        password: hashedPassword,
        salt,
      },
      repository: this.userRepository,
      repeatCondition: ['username'],
      modalName: '使用者',
    })

    return {
      id: result.id,
      password: createUserReqDto.password,
    }
  }

  async find(findUserReqDto: FindUserReqDto, isShowPassword = false) {
    const { pageSize = 10, currentPage = 1, ...remain } = findUserReqDto

    const conditions = Object.keys(remain).length > 0 ? remain : undefined
    const skip = pageSize === 0 ? undefined : (currentPage - 1) * pageSize
    const take = pageSize === 0 ? undefined : pageSize

    const [users, total] = await this.userRepository.findAndCount({
      where: {
        isDeleted: 0,
        ...conditions,
      },
      relations: {
        userRoles: {
          role: true,
        },
        dept: true,
      },
      skip,
      take,
    })

    const list = await Promise.all(
      users.map(async user => {
        const { userRoles, ...remain } = user

        // 不顯示密碼
        if (!isShowPassword) {
          delete remain['password']
          delete remain['salt']
        }

        /* 如果「部門」存在，則需要將「部門名稱」和「部門名稱的多語言欄位」一併返回 */
        if (remain.dept) {
          // 如果「multilingualFields」不存在，則需要初始化
          if (!remain['multilingualFields']) {
            remain['multilingualFields'] = {}
          }
          remain['deptName'] = remain.dept.name
          remain['multilingualFields']['deptName'] = await this.multilingualFieldsRepository.find({
            where: {
              fieldId: remain.dept.name,
              isDeleted: 0,
            },
          })
        }

        return {
          ...remain,
          role: userRoles?.map(item => item.role.code),
          roleIds: userRoles?.map(item => item.role.id),
        }
      }),
    )

    return {
      total,
      list,
    }
  }

  async update(updateUserReqDto: UpdateUserReqDto) {
    const { id, ...remain } = updateUserReqDto

    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')

    // 將 remain 轉換為 Partial<UserEntity> 型別
    const updateData: Partial<UserEntity> = { ...remain }
    if (updateData.password) {
      const { hashedPassword, salt } = encryptPassword(updateData.password)
      updateData.password = hashedPassword
      updateData.salt = salt
    }

    await this.userRepository.update({ id }, updateData)
  }

  // 邏輯刪除
  async delete(id: string) {
    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')

    await this.userRepository.update({ id }, { isDeleted: 1 })
  }

  // 封鎖使用者
  async block(id: string) {
    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')
    await this.userRepository.update({ id }, { status: 0 })
  }

  // 解封使用者
  async unblock(id: string) {
    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')
    await this.userRepository.update({ id }, { status: 1 })
  }
}

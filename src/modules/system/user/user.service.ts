import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from './entity/user.entity'
import { CreateUserReqDto, FindUserReqDto, UpdateUserReqDto } from './dto/user.req.dto'

import { encryptPassword } from '@/utils/crypto'
import { create } from '@/common/services/base.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
      },
      skip,
      take,
    })

    const list = users.map(user => {
      const { userRoles, ...remain } = user

      if (!isShowPassword) {
        delete remain['password']
        delete remain['salt']
      }

      return {
        ...remain,
        role: userRoles?.map(item => item.role.code),
      }
    })

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

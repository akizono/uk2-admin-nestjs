import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MultilingualFieldsEntity } from '../multilingual-fields/entity/multilingual-fields.entity'
import { UserRoleEntity } from '../user-role/entity/user-role.entity'

import { UserEntity } from './entity/user.entity'
import { CreateUserReqDto, FindUserReqDto, UpdatePasswordReqDto, UpdateUserReqDto } from './dto/user.req.dto'

import { requestContext } from '@/utils/request-context'
import { encryptPassword } from '@/utils/crypto'
import { create } from '@/common/services/base.service'
import { EnvHelper } from '@/utils/env-helper'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MultilingualFieldsEntity)
    private readonly multilingualFieldsRepository: Repository<MultilingualFieldsEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async create(createUserReqDto: CreateUserReqDto) {
    const { roleIds } = createUserReqDto
    delete createUserReqDto.roleIds

    if (!roleIds || roleIds.length === 0) {
      throw new BadRequestException('角色不能為空')
    }

    // 創建使用者
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

    // 使用者綁定角色
    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        await this.userRoleRepository.save({
          userId: result.id,
          roleId,
        })
      }
    }

    return {
      id: result.id,
      password: createUserReqDto.password,
    }
  }

  async find(findUserReqDto: FindUserReqDto, isShowPassword = false) {
    const { pageSize = 10, currentPage = 1, roleIds, ...remain } = findUserReqDto

    const conditions = Object.keys(remain).length > 0 ? remain : undefined
    const skip = pageSize === 0 ? undefined : (currentPage - 1) * pageSize
    const take = pageSize === 0 ? undefined : pageSize

    let users: UserEntity[]
    let total: number

    // 如果有 roleIds 參數，需要進行聯表查詢
    if (roleIds && roleIds.length > 0) {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userRoles', 'userRole')
        .leftJoinAndSelect('userRole.role', 'role')
        .leftJoinAndSelect('user.dept', 'dept')
        .where('user.isDeleted = :isDeleted', { isDeleted: 0 })
        .andWhere('userRole.roleId IN (:...roleIds)', { roleIds })

      // 添加其他篩選條件
      if (conditions) {
        Object.keys(conditions).forEach(key => {
          queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: conditions[key] })
        })
      }

      // 分頁處理
      if (skip !== undefined) {
        queryBuilder.skip(skip)
      }
      if (take !== undefined) {
        queryBuilder.take(take)
      }

      users = await queryBuilder.getMany()
      total = await queryBuilder.getCount()
    } else {
      // 原有的查詢邏輯
      const [usersResult, totalResult] = await this.userRepository.findAndCount({
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
      users = usersResult
      total = totalResult
    }

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
    const { id, roleIds, ...remain } = updateUserReqDto

    if (!roleIds || roleIds.length === 0) {
      throw new BadRequestException('角色不能為空')
    }

    // 檢查使用者是否存在
    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')

    // 將 remain 轉換為 Partial<UserEntity> 型別
    const updateData: Partial<UserEntity> = { ...remain }
    if (updateData.password) {
      const { hashedPassword, salt } = encryptPassword(updateData.password)
      updateData.password = hashedPassword
      updateData.salt = salt
    }

    // 更新使用者
    await this.userRepository.update({ id }, updateData)

    // 更新使用者綁定的角色
    // 1、刪除使用者綁定的所有角色
    await this.userRoleRepository.delete({ userId: id })
    // 2、新增使用者綁定的角色
    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        await this.userRoleRepository.save({
          userId: id,
          roleId,
        })
      }
    }
  }

  // 刪除使用者
  async delete(id: string) {
    const { request } = requestContext.getStore()
    const currentUserId = request['user'].sub
    if (currentUserId === id) throw new BadRequestException('禁止刪除自己')

    if (id === EnvHelper.getString('DB_CONSTANT_DEFAULT_SUPER_ADMIN_USER_ID'))
      throw new BadRequestException('禁止刪除「系統預設的超級管理員」')

    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')

    await this.userRepository.update({ id }, { isDeleted: 1 })
  }

  // 封鎖使用者
  async block(id: string) {
    const { request } = requestContext.getStore()
    const currentUserId = request['user'].sub
    if (currentUserId === id) throw new BadRequestException('禁止封鎖自己')

    if (id === EnvHelper.getString('DB_CONSTANT_DEFAULT_SUPER_ADMIN_USER_ID'))
      throw new BadRequestException('禁止封鎖「系統預設的超級管理員」')

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

  // 更新密碼
  async updatePassword(updatePasswordReqDto: UpdatePasswordReqDto, isCheckUserExist = true) {
    const { userId, password } = updatePasswordReqDto

    if (isCheckUserExist) {
      const existUser = await this.userRepository.findOne({ where: { id: userId, isDeleted: 0, status: 1 } })
      if (!existUser) throw new NotFoundException('請檢查帳號是否正確')
    }

    const { hashedPassword, salt } = encryptPassword(password)
    await this.userRepository.update({ id: userId }, { password: hashedPassword, salt })
  }

  // 根據使用者名稱查詢某個使用者的狀態是否正常並返回資料（正常指status === 1 && isDeleted === 0）
  async getActiveUserByUsername(username: string, isShowPassword = false) {
    const userResponse = await this.find({ username, isDeleted: 0 }, isShowPassword)
    if (!userResponse || userResponse.total === 0) throw new ConflictException('請檢查帳號是否正確')
    const user = userResponse.list[0]
    if (user.status === 0) throw new ConflictException('該帳號已被封禁')

    return user
  }
}

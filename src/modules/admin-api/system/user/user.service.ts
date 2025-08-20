import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MultilingualFieldsEntity } from '../multilingual-fields/entity/multilingual-fields.entity'
import { UserRoleEntity } from '../user-role/entity/user-role.entity'

import { UserEntity } from './entity/user.entity'
import {
  BindEmailOrMobileReqDto,
  CreateUserReqDto,
  FindUserReqDto,
  SendBindEmailReqDto,
  SendBindMobileReqDto,
  UpdatePasswordReqDto,
  UpdatePersonalInfoReqDto,
  UpdateUserReqDto,
} from './dto/user.req.dto'

import { requestContext } from '@/utils/request-context'
import { encryptPassword } from '@/utils/crypto'
import { create } from '@/common/services/base.service'
import { EnvHelper } from '@/utils/env-helper'
import { VerifyCodeUtils } from '@/utils/verify-code-utils'
import { VerifyCodeService } from '@/modules/admin-api/system/verify-code/verify-code.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MultilingualFieldsEntity)
    private readonly multilingualFieldsRepository: Repository<MultilingualFieldsEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    private readonly verifyCodeService: VerifyCodeService,
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
          roleNames: userRoles?.map(item => item.role.name),
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
    const currentUserId = request['user'].id
    if (currentUserId === id) throw new BadRequestException('禁止刪除自己')

    if (id === EnvHelper.getString('DB_CONSTANT_DEFAULT_SUPER_ADMIN_USER_ID'))
      throw new BadRequestException('禁止刪除「系統預設的超級管理員」')

    const userResponse = await this.find({ id })
    if (!userResponse || userResponse.total === 0) throw new NotFoundException('使用者不存在')

    await this.userRepository.update({ id }, { isDeleted: 1 })
  }

  // 封鎖使用者
  async block(id: string) {
    const { request } = requestContext.getStore()
    const currentUserId = request['user'].id
    if (currentUserId === id) throw new BadRequestException('禁止封鎖自己')

    if (id === EnvHelper.getString('DB_CONSTANT_DEFAULT_SUPER_ADMIN_USER_ID'))
      throw new BadRequestException('禁止封鎖「系統預設的超級管理員」')

    const userResponse = await this.find({ id })
    if (!userResponse || userResponse.total === 0) throw new NotFoundException('使用者不存在')

    await this.userRepository.update({ id }, { status: 0 })
  }

  // 解封使用者
  async unblock(id: string) {
    const userResponse = await this.find({ id })
    if (!userResponse || userResponse.total === 0) throw new NotFoundException('使用者不存在')

    await this.userRepository.update({ id }, { status: 1 })
  }

  // 更新密碼
  async updatePassword(updatePasswordReqDto: UpdatePasswordReqDto, isCheckUserExist = true) {
    const { userId, password } = updatePasswordReqDto

    if (isCheckUserExist) {
      const userResponse = await this.find({ id: userId, status: 1 })
      if (!userResponse || userResponse.total === 0) throw new NotFoundException('使用者不存在')
    }

    const { hashedPassword, salt } = encryptPassword(password)
    await this.userRepository.update({ id: userId }, { password: hashedPassword, salt })
  }

  // 根據使用者名稱查詢某個使用者的狀態是否正常並返回資料（正常指status === 1 && isDeleted === 0）
  async getActiveUserByUsername(username: string, isShowPassword = false) {
    const userResponse = await this.find({ username, status: 1 }, isShowPassword)
    if (!userResponse || userResponse.total === 0) throw new ConflictException('請檢查帳號是否正確')
    const user = userResponse.list[0]

    return user
  }

  // 根據使用者ID查詢某個使用者的狀態是否正常並返回資料（正常指status === 1 && isDeleted === 0）
  async getActiveUserById(id: string, isShowPassword = false) {
    const userResponse = await this.find({ id, status: 1 }, isShowPassword)
    if (!userResponse || userResponse.total === 0) throw new ConflictException('請檢查帳號是否正確')
    const user = userResponse.list[0]

    return user
  }

  /** 發送用於綁定信箱的「驗證碼」到使用者信箱 */
  async sendBindEmail(sendBindEmailReqDto: SendBindEmailReqDto) {
    const { email } = sendBindEmailReqDto
    const type = 'email'
    const scene = 'bind-email'

    // 查詢信箱是否被使用
    const user = await this.find({ email })
    if (user.total > 0) throw new ConflictException('信箱已被使用')

    // 生成驗證碼並發送
    await VerifyCodeUtils.generateVerifyCodeAndSend({
      verifyCodeService: this.verifyCodeService,
      type,
      scene,
      userEmail: email,
    })
  }

  /** 發送用於綁定手機號碼的「驗證碼」到使用者手機 */
  async sendBindMobile(sendBindMobileReqDto: SendBindMobileReqDto) {
    const { mobile } = sendBindMobileReqDto
    const type = 'mobile'
    const scene = 'bind-mobile'

    // 查詢手機是否被使用
    const user = await this.find({ mobile })
    if (user.total > 0) throw new ConflictException('手機號碼已被使用')

    // 生成驗證碼並發送
    await VerifyCodeUtils.generateVerifyCodeAndSend({
      verifyCodeService: this.verifyCodeService,
      type,
      scene,
      userMobile: mobile,
    })
  }

  /** 綁定信箱或者手機 */
  async bindEmailOrMobile(_bindEmailOrMobileReqDto: BindEmailOrMobileReqDto) {
    const { verifyCode, verifyCodeType, ...bindEmailOrMobileReqDto } = _bindEmailOrMobileReqDto

    /* 檢查信箱或者手機是否被使用 */
    if (verifyCodeType === 'email') {
      const userResponse = await this.find({ email: bindEmailOrMobileReqDto.email })
      if (userResponse.total > 0) throw new ConflictException('信箱已被使用')
    } else if (verifyCodeType === 'mobile') {
      const userResponse = await this.find({ mobile: bindEmailOrMobileReqDto.mobile })
      if (userResponse.total > 0) throw new ConflictException('手機號碼已被使用')
    }

    /* 驗證驗證碼 */
    const data = {
      verifyCodeService: this.verifyCodeService,
      type: verifyCodeType,
      scene: verifyCodeType === 'email' ? 'bind-email' : 'bind-mobile',
      inputCode: verifyCode,
    }
    if (verifyCodeType === 'email') {
      data['userEmail'] = bindEmailOrMobileReqDto.email
    } else if (verifyCodeType === 'mobile') {
      data['userMobile'] = bindEmailOrMobileReqDto.mobile
    }
    await VerifyCodeUtils.validateVerifyCode(data)

    // 獲取自己的id
    const { request } = requestContext.getStore()
    const currentUserId = request['user'].id

    // 更新自己的信箱或者手機
    await this.userRepository.update(
      { id: currentUserId },
      {
        email: bindEmailOrMobileReqDto.email,
        mobile: bindEmailOrMobileReqDto.mobile,
      },
    )
  }

  /** 修改個人資訊 */
  async updatePersonalInfo(updatePersonalInfoReqDto: UpdatePersonalInfoReqDto) {
    const { request } = requestContext.getStore()
    const currentUserId = request['user'].id

    await this.userRepository.update({ id: currentUserId }, updatePersonalInfoReqDto)
  }

  /** 獲取個人資訊 */
  async getPersonalInfo() {
    const { request } = requestContext.getStore()

    // 直接返回即可，在守衛中獲取使用者資料不過是幾十毫秒前的事情，基本上就是最新的資料了
    return request['user']
  }
}

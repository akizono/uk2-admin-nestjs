import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { encryptPassword } from '@/utils/crypto'

import { UserEntity } from './entity/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 定義共用的 select 欄位
  private readonly select = {
    id: true,
    username: true,
    nickname: true,
    remark: true,
    email: true,
    mobile: true,
    sex: true,
    avatar: true,
    status: true,
    isDeleted: true,
    createTime: true,
    updateTime: true,
  } as const

  // 建立使用者
  async create(createUserDto: CreateUserDto) {
    const { username, password, ...remain } = createUserDto

    const existUser = await this.userRepository.findOne({ where: { username } })
    if (existUser) throw new ConflictException('使用者已存在')

    const { hashedPassword, salt } = encryptPassword(password)

    const newUser = this.userRepository.create({
      ...remain,
      username,
      password: hashedPassword,
      salt,
    })
    await this.userRepository.save(newUser)
  }

  // 查詢所有使用者
  async findAll() {
    const users = await this.userRepository.find({
      select: this.select,
      relations: {
        userRoles: {
          role: true,
        },
      },
    })

    return users.map(user => {
      const { userRoles, ...remain } = user
      return {
        userInfo: remain,
        role: userRoles?.map(item => item.role.code),
      }
    })
  }

  // 根據id查詢單一使用者
  async findOneById(id: string) {
    const userInfo = await this.userRepository.findOne({
      select: this.select,
      where: { id },
      relations: {
        userRoles: {
          role: true,
        },
      },
    })

    if (!userInfo) throw new NotFoundException('使用者不存在')

    const { userRoles, ...remain } = userInfo
    return {
      userInfo: remain,
      role: userRoles?.map(item => item.role.code),
    }
  }

  // 根據username查詢單一使用者
  async findOneByUsername(username: string, isShowPassword = false) {
    const userInfo = await this.userRepository.findOne({
      select: {
        password: isShowPassword,
        salt: isShowPassword,
        ...this.select,
      },
      where: { username },
      relations: {
        userRoles: {
          role: true,
        },
      },
    })

    if (!userInfo) throw new NotFoundException('使用者不存在')

    const { userRoles, ...remain } = userInfo
    return {
      userInfo: remain,
      role: userRoles?.map(item => item.role.code),
    }
  }

  // 更新使用者
  async update(updateUserDto: UpdateUserDto) {
    const { id, ...remain } = updateUserDto

    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')

    // 將 remain 轉換為 Partial<UserEntity> 型別
    const updateData: Partial<UserEntity> = { ...remain }
    if (updateData.password) {
      const { hashedPassword, salt } = encryptPassword(updateData.password)
      updateData.password = hashedPassword
      updateData.salt = salt
    }

    await this.userRepository.update(id, updateData)
  }

  // 刪除使用者
  async delete(id: string) {
    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('使用者不存在')

    await this.userRepository.update(id, { isDeleted: 1 })
  }
}

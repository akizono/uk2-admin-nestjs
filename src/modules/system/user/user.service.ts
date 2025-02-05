import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { encryptPassword } from '@/utils/crypto'

import { UserEntity } from './entity/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUserDto } from './dto/find-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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
    return {
      id: newUser.id,
      password,
    }
  }

  async find(findUserDto: FindUserDto, isShowPassword = false) {
    const { pageSize = 10, currentPage = 1, ...remain } = findUserDto

    const skip = (currentPage - 1) * pageSize
    const conditions = Object.keys(remain).length > 0 ? remain : undefined

    const [users, total] = await this.userRepository.findAndCount({
      select: {
        password: isShowPassword,
        salt: isShowPassword,

        id: true,
        username: true,
        nickname: true,
        email: true,
        mobile: true,
        age: true,
        sex: true,
        avatar: true,
        remark: true,
        status: true,
      },
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
      take: pageSize,
    })

    const list = users.map(user => {
      const { userRoles, ...remain } = user
      return {
        userInfo: remain,
        role: userRoles?.map(item => item.role.code),
      }
    })

    return {
      total,
      list,
    }
  }

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

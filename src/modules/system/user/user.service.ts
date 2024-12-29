import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { encryptPassword } from '@/utils/crypto'

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

  private readonly selectFields = ['password', 'salt'] as const

  // 查詢所有用戶
  async findAll(): Promise<Omit<UserEntity, (typeof this.selectFields)[number]>[]> {
    const users = await this.userRepository.find({
      select: this.select,
    })
    return users
  }

  // 根據id查詢單一用戶
  async findOneById(id: number): Promise<Omit<UserEntity, (typeof this.selectFields)[number]>> {
    const user = await this.userRepository.findOne({
      select: this.select,
      where: { id },
    })

    if (!user) throw new NotFoundException('用戶不存在')
    return user
  }

  // 根據username查詢單一用戶
  async findOneByUsername(
    username: string,
    isShowPassword = false,
  ): Promise<
    Partial<Pick<UserEntity, (typeof this.selectFields)[number]>> & Omit<UserEntity, (typeof this.selectFields)[number]>
  > {
    const user = await this.userRepository.findOne({
      select: {
        password: isShowPassword,
        salt: isShowPassword,
        ...this.select,
      },
      where: { username },
    })

    if (!user) throw new NotFoundException('用戶不存在')
    return user
  }

  // 創建用戶
  async create(createUserDto: CreateUserDto) {
    const { username, password, ...rest } = createUserDto

    const existUser = await this.userRepository.findOne({ where: { username } })
    if (existUser) throw new ConflictException('用戶已存在')

    const { hashedPassword, salt } = encryptPassword(password)

    const newUser = this.userRepository.create({
      ...rest,
      username,
      password: hashedPassword,
      salt,
    })
    await this.userRepository.save(newUser)
  }

  // 更新用戶
  async update(updateUserDto: UpdateUserDto) {
    const { id, ...rest } = updateUserDto

    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('用戶不存在')

    if (rest.password) {
      const { hashedPassword, salt } = encryptPassword(rest.password)
      rest.password = hashedPassword
      rest.salt = salt
    }
    await this.userRepository.update(id, rest)
  }

  // 刪除用戶
  async delete(id: number) {
    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('用戶不存在')

    await this.userRepository.update(id, { isDeleted: 1 })
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SystemUserEntity } from './entity/system.user.entity'
import { CreateSystemUserDto } from './dto/create-system-user.dto'
import { UpdateSystemUserDto } from './dto/update-system-user.dto'
import { encryptPassword } from '@/utils/crypto'

@Injectable()
export class SystemUserService {
  constructor(
    @InjectRepository(SystemUserEntity)
    private readonly systemUserRepository: Repository<SystemUserEntity>,
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
  async findAll(): Promise<Omit<SystemUserEntity, (typeof this.selectFields)[number]>[]> {
    const users = await this.systemUserRepository.find({
      select: this.select,
    })
    return users
  }

  // 根據id查詢單一用戶
  async findOneById(id: number): Promise<Omit<SystemUserEntity, (typeof this.selectFields)[number]>> {
    const user = await this.systemUserRepository.findOne({
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
    Partial<Pick<SystemUserEntity, (typeof this.selectFields)[number]>> &
      Omit<SystemUserEntity, (typeof this.selectFields)[number]>
  > {
    const user = await this.systemUserRepository.findOne({
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
  async create(createSystemUserDto: CreateSystemUserDto) {
    const { username, password, ...rest } = createSystemUserDto

    const existUser = await this.systemUserRepository.findOne({ where: { username } })
    if (existUser) throw new ConflictException('用戶已存在')

    const { hashedPassword, salt } = encryptPassword(password)

    const newSystemUser = this.systemUserRepository.create({
      ...rest,
      username,
      password: hashedPassword,
      salt,
    })
    await this.systemUserRepository.save(newSystemUser)
  }

  // 更新用戶
  async update(updateSystemUserDto: UpdateSystemUserDto) {
    const { id, ...rest } = updateSystemUserDto

    const existUser = await this.systemUserRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('用戶不存在')

    if (rest.password) {
      const { hashedPassword, salt } = encryptPassword(rest.password)
      rest.password = hashedPassword
      rest.salt = salt
    }
    await this.systemUserRepository.update(id, rest)
  }

  // 刪除用戶
  async delete(id: number) {
    const existUser = await this.systemUserRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('用戶不存在')

    await this.systemUserRepository.update(id, { isDeleted: 1 })
  }
}

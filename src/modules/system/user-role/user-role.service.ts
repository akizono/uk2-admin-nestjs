import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRoleEntity } from './entity/user-role.entity'
import { CreateUserRoleDto } from './dto/create-user-role-dto'

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    const { userId, roleId } = createUserRoleDto

    const userRole = await this.userRoleRepository.findOne({ where: { userId, roleId } })
    if (userRole) throw new ConflictException('使用者已經綁定了該角色')

    return this.userRoleRepository.save(createUserRoleDto)
  }
}

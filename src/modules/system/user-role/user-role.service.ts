import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRoleEntity } from './entity/user-role.entity'
import { CreateUserRoleReqDto } from './dto/user-role.req.dto'
@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async create(createUserRoleReqDto: CreateUserRoleReqDto) {
    const { userId, roleId } = createUserRoleReqDto

    const userRole = await this.userRoleRepository.findOne({ where: { userId, roleId } })
    if (userRole) throw new ConflictException('使用者已經綁定了該角色')

    await this.userRoleRepository.save(createUserRoleReqDto)
  }
}

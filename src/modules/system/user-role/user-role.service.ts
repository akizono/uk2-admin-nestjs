import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRoleEntity } from './entity/user-role.entity'
import { CreateUserRoleReqDto } from './dto/user-role.req.dto'

import { create } from '@/common/services/base.service'

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async create(createUserRoleReqDto: CreateUserRoleReqDto) {
    return await create({
      dto: createUserRoleReqDto,
      repository: this.userRoleRepository,
      modalName: '使用者角色',
      existenceCondition: ['userId', 'roleId'],
    })
  }
}

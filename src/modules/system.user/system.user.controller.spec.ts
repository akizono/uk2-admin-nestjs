import { Test, TestingModule } from '@nestjs/testing'
import { SystemUserController } from './system.user.controller'

describe('SystemUserController', () => {
  let controller: SystemUserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemUserController],
    }).compile()

    controller = module.get<SystemUserController>(SystemUserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

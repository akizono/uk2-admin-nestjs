import { Test, TestingModule } from '@nestjs/testing'
import { SystemAuthController } from './system.auth.controller'

describe('SystemAuthController', () => {
  let controller: SystemAuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemAuthController],
    }).compile()

    controller = module.get<SystemAuthController>(SystemAuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

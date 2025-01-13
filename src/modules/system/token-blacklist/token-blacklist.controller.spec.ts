import { Test, TestingModule } from '@nestjs/testing'
import { TokenBlacklistController } from './token-blacklist.controller'

describe('TokenBlacklistController', () => {
  let controller: TokenBlacklistController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenBlacklistController],
    }).compile()

    controller = module.get<TokenBlacklistController>(TokenBlacklistController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

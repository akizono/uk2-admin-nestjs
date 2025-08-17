import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'

import { JwtRequest, AuthenticatedUser, Payload } from './types'
import {
  CheckUserHasMobileOrEmailReqDto,
  LoginReqDto,
  SendResetPasswordEmailReqDto,
  SendResetPasswordMobileReqDto,
  UpdatePasswordReqDto,
} from './dto/auth.req.dto'

import { StrGenerator } from '@/utils/str-generator'
import { encryptPassword } from '@/utils/crypto'
import { EnvHelper } from '@/utils/env-helper'
import { UserService } from '@/modules/admin-api/system/user/user.service'
import { VerifyCodeService } from '@/modules/admin-api/system/verify-code/verify-code.service'
import { TokenBlacklistService } from '@/modules/admin-api/system/token-blacklist/token-blacklist.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly verifyCodeService: VerifyCodeService,
  ) {}

  async validateUser(username: string, inputPassword: string): Promise<AuthenticatedUser | null> {
    const { list } = await this.userService.find(
      {
        username,
        isDeleted: 0,
        status: 1,
      },
      true,
    )
    if (list.length === 0) throw new UnauthorizedException('使用者名稱或密碼錯誤')

    const user = list[0]
    const { hashedPassword } = encryptPassword(inputPassword, user.salt)
    if (user.password === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...userInfoFilter } = user
      return {
        ...userInfoFilter,
      }
    } else {
      return null
    }
  }

  async generateToken(userId: string, role: string[], type: 'access' | 'refresh') {
    const payload = {
      sub: userId,
      role,
      type,
      jti: uuidv4(),
    }

    // 設定 Token 過期時間
    let expiresIn: number
    if (type === 'access') expiresIn = eval(EnvHelper.getString('JWT_ACCESS_TOKEN_EXPIRES_IN'))
    if (type === 'refresh') expiresIn = eval(EnvHelper.getString('JWT_REFRESH_TOKEN_EXPIRES_IN'))

    // 返回Token
    return await this.jwtService.signAsync(payload, { expiresIn })
  }

  /** 登入 */
  async login(loginReqDto: LoginReqDto) {
    const user = await this.validateUser(loginReqDto.username, loginReqDto.password)
    if (!user) throw new UnauthorizedException('密碼錯誤')

    return {
      ...user,
      token: {
        accessToken: await this.generateToken(user.id, user.role, 'access'),
        refreshToken: await this.generateToken(user.id, user.role, 'refresh'),
      },
    }
  }

  /** 刷新 Token */
  async refreshTokenMethod(request: JwtRequest) {
    const { accessPayload, refreshPayload, accessToken, refreshToken } = request

    // 如果過期則更新 Token 否則返回原 Token
    const renewTokenIfExpiringSoon = async (payload: Payload, token: string) => {
      // 計算當前時間到過期時間的剩餘秒數
      const timeUntilExpiry = payload.exp - Math.floor(Date.now() / 1000)

      // 如果剩餘時間小於 1800秒
      if (timeUntilExpiry < 1800) {
        if (timeUntilExpiry > 0) await this.tokenBlacklistService.create(payload) // 將未過期的 Token 加入黑名單
        return await this.generateToken(payload.sub, payload.role, payload.type) // 返回新的 Token
      }
      return token
    }

    return {
      accessToken: await renewTokenIfExpiringSoon(accessPayload, accessToken),
      refreshToken: await renewTokenIfExpiringSoon(refreshPayload, refreshToken),
    }
  }

  /** 檢查使用者是否擁有手機號碼或者信箱 */
  async checkUserHasMobileOrEmail(checkUserHasMobileOrEmailReqDto: CheckUserHasMobileOrEmailReqDto) {
    const { username } = checkUserHasMobileOrEmailReqDto

    // 查詢使用者
    const userResponse = await this.userService.find({ username, isDeleted: 0 })
    if (!userResponse || userResponse.total === 0) throw new ConflictException('請檢查帳號是否正確')
    const user = userResponse.list[0]
    if (user.status === 0) throw new ConflictException('該帳號已被封禁')

    return {
      hasMobile: user.mobile ? true : false,
      hasEmail: user.email ? true : false,
    }
  }

  /** 生成驗證碼並發送 */
  async generateVerifyCodeAndSend(userId: string, type: string, scene: string) {
    // 查詢該使用者在此場景下的所有驗證碼
    const verifyCodeResponse = await this.verifyCodeService.find({
      pageSize: 0,
      userId,
      type,
      scene,
    })

    // 如果沒有驗證碼
    if (verifyCodeResponse.total === 0) {
      // 則創建驗證碼
      await this.verifyCodeService.create({
        code: StrGenerator.generateNumeric(6),
        userId,
        type,
        scene,
      })

      // TODO：在此處執行發送驗證碼的邏輯
    }

    // 如果有驗證碼
    else if (verifyCodeResponse.total > 0) {
      // 則從所有驗證碼中拿到日期最新的那條驗證碼的數據
      const verifyCodeData = verifyCodeResponse.list.sort((a, b) => b.createTime - a.createTime)[0]

      // 檢查驗證碼的「創建時間」距離現在是否小於60秒
      // 如果是，則返回錯誤
      if (verifyCodeData.createTime > new Date(Date.now() - 60 * 1000)) {
        throw new BadRequestException('操作過於頻繁，請稍後再試')
      }
      // 如果不是
      else {
        // 刪除所有驗證碼
        await this.verifyCodeService.deleteUserAllVerifyCodes(userId)

        // 創建新的驗證碼
        await this.verifyCodeService.create({
          code: StrGenerator.generateNumeric(6),
          userId,
          type,
          scene,
        })

        // TODO：在此處執行發送驗證碼的邏輯
      }
    }
  }

  /** 發送「驗證碼」到使用者信箱 */
  async sendResetPasswordEmail(sendResetPasswordEmailReqDto: SendResetPasswordEmailReqDto) {
    const { username } = sendResetPasswordEmailReqDto
    const scene = 'retrieve-password'
    const type = 'email'

    // 查詢使用者
    const userResponse = await this.userService.find({ username, isDeleted: 0 })
    if (!userResponse || userResponse.total === 0) throw new ConflictException('請檢查帳號是否正確')
    const user = userResponse.list[0]
    if (user.status === 0) throw new ConflictException('該帳號已被封禁')

    // 生成驗證碼並發送
    await this.generateVerifyCodeAndSend(user.id, type, scene)
  }

  /** 發送「驗證碼」到使用者手機 */
  async sendResetPasswordMobile(sendResetPasswordMobileReqDto: SendResetPasswordMobileReqDto) {
    const { username } = sendResetPasswordMobileReqDto
    const scene = 'retrieve-password'
    const type = 'mobile'

    // 查詢使用者
    const userResponse = await this.userService.find({ username, isDeleted: 0 })
    if (!userResponse || userResponse.total === 0) throw new ConflictException('請檢查帳號是否正確')
    const user = userResponse.list[0]
    if (user.status === 0) throw new ConflictException('該帳號已被封禁')

    // 生成驗證碼並發送
    await this.generateVerifyCodeAndSend(user.id, type, scene)
  }

  /** 修改密碼 */
  async updatePassword(updatePasswordReqDto: UpdatePasswordReqDto) {
    const { username, password, verifyCode, verifyCodeType } = updatePasswordReqDto
    const scene = 'retrieve-password'

    // 查詢使用者
    const userResponse = await this.userService.find({ username, isDeleted: 0 })
    if (!userResponse || userResponse.total === 0) throw new ConflictException('請檢查帳號是否正確')
    const user = userResponse.list[0]
    if (user.status === 0) throw new ConflictException('該帳號已被封禁')

    // 查詢該使用者在此場景下的所有驗證碼
    const verifyCodeResponse = await this.verifyCodeService.find({
      pageSize: 0,
      userId: user.id,
      type: verifyCodeType,
      scene,
    })

    // 如果沒有驗證碼
    if (verifyCodeResponse.total === 0) {
      // 提示「驗證碼錯誤」就可以了，使用者多次錯誤後應該會重新發送的吧@_@
      throw new BadRequestException('驗證碼錯誤')
    }

    // 如果有驗證碼
    else if (verifyCodeResponse.total > 0) {
      // 則從所有驗證碼中拿到日期最新的那條驗證碼的數據
      const verifyCodeData = verifyCodeResponse.list.sort((a, b) => b.createTime - a.createTime)[0]

      // 檢查驗證碼是否過期：「創建時間」距離現在是否大於900秒
      if (verifyCodeData.createTime < new Date(Date.now() - 900 * 1000)) {
        throw new BadRequestException('驗證碼錯誤')
      }

      // 檢查驗證碼是否正確
      if (verifyCodeData.code !== verifyCode) {
        throw new BadRequestException('驗證碼錯誤')
      }
    }

    // 校驗成功: 開始更新密碼
    await this.userService.updatePassword({ userId: user.id, password }, false)
  }
}

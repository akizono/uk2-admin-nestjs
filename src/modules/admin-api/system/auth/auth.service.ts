import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'

import { JwtRequest, AuthenticatedUser, Payload } from './types'
import {
  CheckUserHasMobileOrEmailReqDto,
  LoginReqDto,
  RegisterReqDto,
  SendRegisterEmailReqDto,
  SendRegisterMobileReqDto,
  SendResetPasswordEmailReqDto,
  SendResetPasswordMobileReqDto,
  UpdatePasswordReqDto,
} from './dto/auth.req.dto'

import { encryptPassword } from '@/utils/crypto'
import { EnvHelper } from '@/utils/env-helper'
import { VerifyCodeUtils } from '@/utils/verify-code-utils'
import { UserService } from '@/modules/admin-api/system/user/user.service'
import { VerifyCodeService } from '@/modules/admin-api/system/verify-code/verify-code.service'
import { TokenBlacklistService } from '@/modules/admin-api/system/token-blacklist/token-blacklist.service'

const isLoginCaptchaEnabled = EnvHelper.getBoolean('IS_LOGIN_CAPTCHA_ENABLED')

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly verifyCodeService: VerifyCodeService,
  ) {}

  // username: string, inputPassword: string
  async validateUser({
    userId,
    username,
    inputPassword,
    inputVerifyCode,
    svgCaptchaId,
  }: {
    userId?: string
    username?: string
    inputPassword: string
    inputVerifyCode?: string
    svgCaptchaId?: string
  }): Promise<AuthenticatedUser | null> {
    // username 和 userId 必須二選一
    if (!userId && !username) throw new BadRequestException('缺少必要參數')

    // 如果登入驗證碼開啟，則必须传入驗證碼
    if (isLoginCaptchaEnabled && !inputVerifyCode && !svgCaptchaId) throw new BadRequestException('缺少必要參數')

    // 验证图形验证码
    if (isLoginCaptchaEnabled) {
      await VerifyCodeUtils.validateImageVerifyCode({
        verifyCodeService: this.verifyCodeService,
        type: 'image',
        scene: 'login',
        inputCode: inputVerifyCode,
        svgCaptchaId,
      })
    }

    const { list } = await this.userService.find(
      {
        id: userId,
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

  async generateToken(userId: string, type: 'access' | 'refresh') {
    const payload = {
      sub: userId,
      type,
      jti: uuidv4(),
    }

    // 設定 Token 過期時間
    let expiresIn: number
    if (type === 'access') expiresIn = EnvHelper.getNumber('JWT_ACCESS_TOKEN_EXPIRES_IN')
    if (type === 'refresh') expiresIn = EnvHelper.getNumber('JWT_REFRESH_TOKEN_EXPIRES_IN')

    // 返回Token
    return await this.jwtService.signAsync(payload, { expiresIn })
  }

  /** 登入 */
  async login(loginReqDto: LoginReqDto) {
    const user = await this.validateUser({
      username: loginReqDto.username,
      inputPassword: loginReqDto.password,
      inputVerifyCode: loginReqDto.verifyCode,
      svgCaptchaId: loginReqDto.svgCaptchaId,
    })
    if (!user) throw new UnauthorizedException('密碼錯誤')

    return {
      ...user,
      token: {
        accessToken: await this.generateToken(user.id, 'access'),
        refreshToken: await this.generateToken(user.id, 'refresh'),
      },
    }
  }

  /** 獲取用於登入的圖形驗證碼 */
  async getLoginImageVerifyCode() {
    const { svg, svgCaptchaId } = await VerifyCodeUtils.getImageVerifyCode({
      verifyCodeService: this.verifyCodeService,
      scene: 'login',
      type: 'image',
    })

    return {
      svg,
      svgCaptchaId,
    }
  }

  /** 登出（作用：將 token 加入黑名單） */
  async logout(request: JwtRequest) {
    // console.log('====================')
    // console.log('accessToken', accessToken)
    // console.log('refreshToken', refreshToken)
    // console.log('\r\n')
    // console.log('accessPayload', request.accessPayload)
    // console.log('refreshPayload', request.refreshPayload)

    // 將 token 加入黑名單
    await this.tokenBlacklistService.create(request.accessPayload)
    await this.tokenBlacklistService.create(request.refreshPayload)
  }

  /** 刷新 Token */
  async refreshTokenMethod(request: JwtRequest) {
    const { accessPayload, refreshPayload, accessToken, refreshToken } = request

    const generateFun = async (payload: Payload, token: string) => {
      // 如果是refresh-token,直接返回新的token
      if (payload.type === 'refresh') {
        return await this.generateToken(payload.sub, payload.type)
      }

      // 如果是access-token, 則需要檢查是否過期。 如果過期則更新 Token 否則返回原 Token
      else if (payload.type === 'access') {
        // 計算當前時間到過期時間的剩餘秒數
        const timeUntilExpiry = payload.exp - Math.floor(Date.now() / 1000)

        // 如果剩餘時間小於 30 分鐘
        if (timeUntilExpiry < 60 * 30) {
          if (timeUntilExpiry > 0) await this.tokenBlacklistService.create(payload) // 將未過期的 Token 加入黑名單
          return await this.generateToken(payload.sub, payload.type) // 返回新的 Token
        }
        return token
      }
    }

    return {
      accessToken: await generateFun(accessPayload, accessToken),
      refreshToken: await generateFun(refreshPayload, refreshToken),
    }
  }

  // ------------------------------------------------------------
  // 以下是「註冊」的相關方法
  // ------------------------------------------------------------

  /** 發送註冊的「驗證碼」到使用者信箱 */
  async sendRegisterEmail(sendRegisterEmailReqDto: SendRegisterEmailReqDto) {
    const { email } = sendRegisterEmailReqDto
    const type = 'email'
    const scene = 'register'

    // 查詢信箱是否被使用
    const user = await this.userService.find({ email })
    if (user.total > 0) throw new ConflictException('信箱已被使用')

    // 生成驗證碼並發送
    await VerifyCodeUtils.generateVerifyCodeAndSend({
      verifyCodeService: this.verifyCodeService,
      type,
      scene,
      userEmail: email,
    })
  }

  /** 發送註冊的「驗證碼」到使用者手機 */
  async sendRegisterMobile(sendRegisterMobileReqDto: SendRegisterMobileReqDto) {
    const { mobile } = sendRegisterMobileReqDto
    const type = 'mobile'
    const scene = 'register'

    // 查詢手機是否被使用
    const user = await this.userService.find({ mobile })
    if (user.total > 0) throw new ConflictException('手機號碼已被使用')

    // 生成驗證碼並發送
    await VerifyCodeUtils.generateVerifyCodeAndSend({
      verifyCodeService: this.verifyCodeService,
      type,
      scene,
      userMobile: mobile,
    })
  }

  /** 註冊 */
  async register(_registerReqDto: RegisterReqDto) {
    const { verifyCode, verifyCodeType, ...registerReqDto } = _registerReqDto

    // 驗證驗證碼
    const data = {
      verifyCodeService: this.verifyCodeService,
      type: verifyCodeType,
      scene: 'register',
      inputCode: verifyCode,
    }
    if (verifyCodeType === 'email') data['userEmail'] = registerReqDto.email
    else if (verifyCodeType === 'mobile') data['userMobile'] = registerReqDto.mobile
    await VerifyCodeUtils.validateVerifyCode(data)

    // 校驗成功: 開始註冊
    await this.userService.create({
      ...registerReqDto,
      roleIds: [EnvHelper.getString('DB_CONSTANT_COMMON_ROLE_ID')], // 新使用者的預設角色為「一般使用者」
    })
  }

  // ------------------------------------------------------------
  // 以下是「密碼找回」的相關方法
  // ------------------------------------------------------------

  /** 檢查使用者是否擁有手機號碼或者信箱 */
  async checkUserHasMobileOrEmail(checkUserHasMobileOrEmailReqDto: CheckUserHasMobileOrEmailReqDto) {
    const { username } = checkUserHasMobileOrEmailReqDto
    const user = await this.userService.getActiveUserByUsername(username)

    return {
      hasMobile: user.mobile ? true : false,
      hasEmail: user.email ? true : false,
    }
  }

  /** 發送找回密碼的「驗證碼」到使用者信箱 */
  async sendResetPasswordEmail(sendResetPasswordEmailReqDto: SendResetPasswordEmailReqDto) {
    const { username } = sendResetPasswordEmailReqDto
    const scene = 'retrieve-password'
    const type = 'email'

    // 查詢使用者
    const user = await this.userService.getActiveUserByUsername(username)

    // 生成驗證碼並發送
    await VerifyCodeUtils.generateVerifyCodeAndSend({
      verifyCodeService: this.verifyCodeService,
      userId: user.id,
      type,
      scene,
      userEmail: user.email,
    })
  }

  /** 發送找回密碼的「驗證碼」到使用者手機 */
  async sendResetPasswordMobile(sendResetPasswordMobileReqDto: SendResetPasswordMobileReqDto) {
    const { username } = sendResetPasswordMobileReqDto
    const scene = 'retrieve-password'
    const type = 'mobile'

    // 查詢使用者
    const user = await this.userService.getActiveUserByUsername(username)

    // 生成驗證碼並發送
    await VerifyCodeUtils.generateVerifyCodeAndSend({
      verifyCodeService: this.verifyCodeService,
      userId: user.id,
      type,
      scene,
      userMobile: user.mobile,
    })
  }

  /** 修改密碼 */
  async updatePassword(updatePasswordReqDto: UpdatePasswordReqDto) {
    const { username, password, verifyCode, verifyCodeType } = updatePasswordReqDto
    const scene = 'retrieve-password'

    // 查詢使用者
    const user = await this.userService.getActiveUserByUsername(username)

    // 驗證驗證碼
    const data = {
      verifyCodeService: this.verifyCodeService,
      userId: user.id,
      type: verifyCodeType,
      scene,
      inputCode: verifyCode,
    }
    if (verifyCodeType === 'email') data['userEmail'] = user.email
    else if (verifyCodeType === 'mobile') data['userMobile'] = user.mobile
    await VerifyCodeUtils.validateVerifyCode(data)

    // 校驗成功: 開始更新密碼
    await this.userService.updatePassword({ userId: user.id, password }, false)
  }
}

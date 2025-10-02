import { Body, Controller, Post, UseInterceptors, Req, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ApiHeader } from '@nestjs/swagger'

import { AuthService } from './auth.service'
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
import { CheckUserHasMobileOrEmailResDto, LoginResDto, SendLoginImageVerifyCodeResDto } from './dto/auth.res.dto'

import { Public } from '@/common/decorators/public.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'
import { MsgResponseDto } from '@/utils/response-dto'

@Controller('/platform-api/system/auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @Operation({ type: OperationType.LOGIN, name: '登入', module: 'system-auth' })
  @ApiOperation({ summary: '登入' })
  @ApiResponse({ type: LoginResDto })
  @ResponseMessage('登入成功')
  async login(@Body() loginReqDto: LoginReqDto) {
    return await this.authService.login(loginReqDto)
  }

  @Public()
  @Get('/get-login-image-verify-code')
  @Operation({ type: OperationType.OTHER, name: '獲取用於登入的圖形驗證碼', module: 'system-auth' })
  @ApiOperation({ summary: '獲取用於登入的圖形驗證碼' })
  @ApiResponse({ type: SendLoginImageVerifyCodeResDto })
  @ResponseMessage('獲取成功')
  async getLoginImageVerifyCode() {
    return await this.authService.getLoginImageVerifyCode()
  }

  @Get('/logout')
  @Operation({ type: OperationType.OTHER, name: '登出', module: 'system-auth' })
  @ApiOperation({ summary: '登出' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('登出成功')
  async logout(@Req() request) {
    return await this.authService.logout(request)
  }

  @ApiHeader({ name: 'authorization' })
  @ApiHeader({ name: 'refresh-token' })
  @Post('/refreshTokenMethod') // 注意：此端點路徑與 auth.guard.ts:validateRefreshToken() 存在耦合關係
  @Operation({ type: OperationType.OTHER, name: '刷新Token', module: 'system-auth' })
  @ApiOperation({ summary: '刷新Token', description: '！！該介面無法使用swagger測試，但是功能是正確生效的' })
  @ResponseMessage('成功刷新Token')
  async refreshTokenMethod(@Req() request) {
    return await this.authService.refreshTokenMethod(request)
  }

  @Public()
  @Post('/send-register-email')
  @Operation({ type: OperationType.OTHER, name: '發送「驗證碼」到使用者信箱', module: 'system-auth' })
  @ApiOperation({ summary: '發送「驗證碼」到使用者信箱' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('發送成功')
  async sendRegisterEmail(@Body() sendRegisterEmailReqDto: SendRegisterEmailReqDto) {
    return await this.authService.sendRegisterEmail(sendRegisterEmailReqDto)
  }

  @Public()
  @Post('/send-register-mobile')
  @Operation({ type: OperationType.OTHER, name: '發送「驗證碼」到使用者手機', module: 'system-auth' })
  @ApiOperation({ summary: '發送「驗證碼」到使用者手機' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('發送成功')
  async sendRegisterMobile(@Body() sendRegisterMobileReqDto: SendRegisterMobileReqDto) {
    return await this.authService.sendRegisterMobile(sendRegisterMobileReqDto)
  }

  @Public()
  @Post('/register')
  @Operation({ type: OperationType.OTHER, name: '註冊', module: 'system-auth' })
  @ApiOperation({ summary: '註冊' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('註冊成功')
  async register(@Body() registerReqDto: RegisterReqDto) {
    return await this.authService.register(registerReqDto)
  }

  @Public()
  @Get('/check-user-has-mobile-or-email')
  @Operation({ type: OperationType.OTHER, name: '檢查使用者是否擁有手機號碼或者信箱', module: 'system-auth' })
  @ApiOperation({ summary: '檢查使用者是否擁有手機號碼或者信箱' })
  @ApiResponse({ type: CheckUserHasMobileOrEmailResDto })
  @ResponseMessage('檢查成功')
  async checkUserHasMobileOrEmail(@Query() checkUserHasMobileOrEmailReqDto: CheckUserHasMobileOrEmailReqDto) {
    return await this.authService.checkUserHasMobileOrEmail(checkUserHasMobileOrEmailReqDto)
  }

  @Public()
  @Post('/send-reset-password-email')
  @Operation({ type: OperationType.OTHER, name: '發送「驗證碼」到使用者信箱', module: 'system-auth' })
  @ApiOperation({ summary: '發送「驗證碼」到使用者信箱' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('發送成功')
  async sendResetPasswordEmail(@Body() sendResetPasswordEmailReqDto: SendResetPasswordEmailReqDto) {
    return await this.authService.sendResetPasswordEmail(sendResetPasswordEmailReqDto)
  }

  @Public()
  @Post('/send-reset-password-mobile')
  @Operation({ type: OperationType.OTHER, name: '發送「驗證碼」到使用者手機', module: 'system-auth' })
  @ApiOperation({ summary: '發送「驗證碼」到使用者手機' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('發送成功')
  async sendResetPasswordMobile(@Body() sendResetPasswordMobileReqDto: SendResetPasswordMobileReqDto) {
    return await this.authService.sendResetPasswordMobile(sendResetPasswordMobileReqDto)
  }

  @Public()
  @Post('/update-password')
  @Operation({ type: OperationType.OTHER, name: '修改密碼', module: 'system-auth' })
  @ApiOperation({ summary: '修改密碼' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('修改成功')
  async updatePassword(@Body() updatePasswordReqDto: UpdatePasswordReqDto) {
    return await this.authService.updatePassword(updatePasswordReqDto)
  }
}

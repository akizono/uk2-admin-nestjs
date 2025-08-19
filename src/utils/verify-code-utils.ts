import { BadRequestException } from '@nestjs/common'

import { StrGenerator } from './str-generator'

import { VerifyCodeService } from '@/modules/admin-api/system/verify-code/verify-code.service'
import { VerifyCodeType } from '@/modules/admin-api/system/verify-code/dto/verify-code.req.dto'

/**
 * 生成驗證碼的參數介面
 */
export interface GenerateVerifyCodeParams {
  verifyCodeService: VerifyCodeService
  userId?: string
  type: VerifyCodeType
  scene: string
  userEmail?: string // 使用者信箱
  userMobile?: string // 使用者手機
}

/**
 * 驗證驗證碼的參數介面
 */
export interface ValidateVerifyCodeParams {
  userId?: string
  type: VerifyCodeType
  scene: string // 使用場景
  userEmail?: string // 使用者信箱
  userMobile?: string // 使用者手機

  verifyCodeService: VerifyCodeService
  inputCode: string // 使用者輸入的驗證碼
  expireTimeInSeconds?: number // 驗證碼過期時間
}

/**
 * 驗證碼工具類
 * 提供統一的驗證碼生成、發送和驗證邏輯
 */
export class VerifyCodeUtils {
  /**
   * 生成驗證碼並發送
   * @param params 生成驗證碼的參數對象
   */
  static async generateVerifyCodeAndSend(params: GenerateVerifyCodeParams) {
    const { verifyCodeService, userId, type, scene, userEmail, userMobile } = params

    // 查詢該使用者在此場景下的所有驗證碼
    const verifyCodeResponse = await verifyCodeService.find({
      pageSize: 0,
      userId,
      type,
      scene,
      userEmail,
      userMobile,
    })

    // 如果沒有驗證碼
    if (verifyCodeResponse.total === 0) {
      // 則創建驗證碼
      const data = {
        code: StrGenerator.generateNumeric(6),
        userId,
        type,
        scene,
      }
      if (type === 'email') data['userEmail'] = userEmail
      else if (type === 'mobile') data['userMobile'] = userMobile
      await verifyCodeService.create(data)

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
        await verifyCodeService.deleteUserAllVerifyCodes(userId)

        // 創建新的驗證碼
        const data = {
          code: StrGenerator.generateNumeric(6),
          userId,
          type,
          scene,
        }
        if (type === 'email') data['userEmail'] = userEmail
        else if (type === 'mobile') data['userMobile'] = userMobile
        await verifyCodeService.create(data)

        // TODO：在此處執行發送驗證碼的邏輯
      }
    }
  }

  /**
   * 驗證驗證碼
   * @param params 驗證驗證碼的參數對象
   * @returns Promise<boolean> 驗證是否成功
   */
  static async validateVerifyCode(params: ValidateVerifyCodeParams): Promise<boolean> {
    const {
      verifyCodeService,
      userId,
      type,
      scene,
      inputCode,
      expireTimeInSeconds = 900,
      userEmail,
      userMobile,
    } = params

    // 查詢該使用者在此場景下的所有驗證碼
    const verifyCodeResponse = await verifyCodeService.find({
      pageSize: 0,
      userId,
      type,
      scene,
      userEmail,
      userMobile,
    })

    // 如果沒有驗證碼
    if (verifyCodeResponse.total === 0) {
      throw new BadRequestException('驗證碼錯誤')
    }

    // 如果有驗證碼
    if (verifyCodeResponse.total > 0) {
      // 則從所有驗證碼中拿到日期最新的那條驗證碼的數據
      const verifyCodeData = verifyCodeResponse.list.sort((a, b) => b.createTime - a.createTime)[0]

      // 檢查驗證碼是否過期
      if (verifyCodeData.createTime < new Date(Date.now() - expireTimeInSeconds * 1000)) {
        throw new BadRequestException('驗證碼錯誤')
      }

      // 檢查驗證碼是否正確
      if (verifyCodeData.code !== inputCode) {
        throw new BadRequestException('驗證碼錯誤')
      }

      return true
    }

    return false
  }
}

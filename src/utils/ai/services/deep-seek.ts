import OpenAI from 'openai'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index'
import { BadRequestException } from '@nestjs/common'

import { EnvHelper } from '@/utils/env-helper'

const openAIClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: EnvHelper.getString('DEEP_SEEK_API_KEY'),
})

/**
 * 與 deepSeek 模型互動的函式
 * @param {ChatCompletionCreateParamsNonStreaming} params - deepSeek 請求的參數
 * @returns {Promise<string>} - AI 的回應文字
 */
export default async function deepSeek(params: ChatCompletionCreateParamsNonStreaming) {
  try {
    const response = await openAIClient.chat.completions.create(params)
    const content = response.choices[0].message.content

    if (!content || typeof content !== 'string') {
      throw new BadRequestException('AI 回應錯誤，請聯繫管理員進行調整')
    }

    return content
  } catch (error) {
    console.error('呼叫 deepSeek 時發生錯誤:', error)
    throw error
  }
}

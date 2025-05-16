import OpenAI from 'openai'

import { EnvHelper } from '@/utils/env-helper'

const openAIClient = new OpenAI({
  apiKey: EnvHelper.getString('OPENAI_API_KEY'),
})

interface Gpt4oNanoParams {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
  debug?: boolean
}

/**
 * 與 GPT-4o-nano 模型互動的函式
 * @param {Object} params - GPT-4o-nano 請求的參數
 * @param {string} params.systemPrompt - AI 行為的指示
 * @param {string} params.userPrompt - 使用者的問題或請求
 * @param {number} [params.temperature=0.7] - 控制隨機性 (0-2，數值越低越具決定性)
 * @param {number} [params.maxTokens=1000] - 回應中的最大 token 數
 * @param {boolean} [params.debug=false] - 是否記錄除錯資訊
 * @returns {Promise<string>} - AI 的回應文字
 */
const gpt4oNano = async (params: Gpt4oNanoParams) => {
  const { systemPrompt, userPrompt, temperature = 0.7, maxTokens = 1000, debug = false } = params

  if (!systemPrompt) {
    throw new Error('系統提示是指示 AI 所必需的')
  }

  if (!userPrompt) {
    throw new Error('使用者提示是詢問 AI 所必需的')
  }

  try {
    // Debug logging
    if (debug) {
      console.log('Sending request to GPT-4o-nano with:\r\n')
      console.log(`System prompt: ${systemPrompt}\r\n`)
      console.log(`User prompt: ${userPrompt}\r\n`)
    }

    // 建立完成請求
    const response = await openAIClient.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    })

    // 提取回應文字
    const responseText = response.choices[0].message.content

    // Debug logging
    if (debug) {
      console.log('Received response:')
      console.log(responseText)
    }

    return responseText
  } catch (error) {
    console.error('呼叫 GPT-4o-nano 時發生錯誤:', error)
    throw error
  }
}
export default gpt4oNano

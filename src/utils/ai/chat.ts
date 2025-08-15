import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index'

import chatGPT from './services/chat-gpt'
import deepSeek from './services/deep-seek'

export default async function chat(modelName: string, params: ChatCompletionCreateParamsNonStreaming) {
  try {
    switch (modelName) {
      case 'chatGPT':
        return await chatGPT(params)
      case 'deepSeek':
        return await deepSeek(params)
      default:
        throw new Error(`不支持「${modelName}」模型 `)
    }
  } catch (error) {
    throw error
  }
}

import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionOptions {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface ChatResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function getChatCompletion({
  messages,
  model = 'gpt-3.5-turbo',
  temperature = 0.7,
  maxTokens = 1000
}: ChatCompletionOptions): Promise<ChatResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return {
      content: response,
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      } : undefined
    }

  } catch (error) {
    console.error('Error getting chat completion:', error)
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      if (error.message.includes('insufficient_quota')) {
        throw new Error('API quota exceeded. Please check your OpenAI account.')
      }
      if (error.message.includes('invalid_api_key')) {
        throw new Error('Invalid API key. Please check your OpenAI configuration.')
      }
    }
    
    throw new Error('Failed to get response from AI assistant')
  }
}

export async function getAssistantResponse(userMessage: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful AI assistant for an internal team dashboard. Provide clear, concise, and helpful responses to team members\' questions. Be professional but friendly.'
    },
    {
      role: 'user',
      content: userMessage
    }
  ]

  const response = await getChatCompletion({ messages })
  return response.content
}

export default openai

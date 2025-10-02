export interface Message {
  id: string
  question: string
  answer: string
  createdAt: Date
  updatedAt: Date
  knowledgeBaseEntry?: KnowledgeBaseEntry | null
}

export interface KnowledgeBaseEntry {
  id: string
  question: string
  answer: string
  title?: string | null
  tags?: string | null
  isPinned: boolean
  category?: string | null
  createdAt: Date
  updatedAt: Date
  messageId?: string | null
  message?: Message | null
}

export interface Category {
  id: string
  name: string
  description?: string | null
  color?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface SavedQA {
  id: string
  question: string
  answer: string
  title?: string
  tags: string[]
  isPinned: boolean
  category?: string
  createdAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

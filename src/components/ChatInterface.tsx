'use client'

import { useState } from 'react'
import { Send, Bot, User, AlertTriangle } from 'lucide-react'
import { Message } from '@/types'

interface ChatInterfaceProps {
  onNewMessage: (message: Message) => void
}

export default function ChatInterface({ onNewMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentConversation, setCurrentConversation] = useState<{
    question: string
    answer: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const question = input.trim()
    setInput('')
    setIsLoading(true)
    setError(null)
    setCurrentConversation({ question, answer: '' })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question })
      })

      const data = await response.json()
      
      if (data.success) {
        const newMessage: Message = {
          id: data.data.id,
          question: data.data.question,
          answer: data.data.answer,
          createdAt: new Date(data.data.createdAt),
          updatedAt: new Date(data.data.createdAt)
        }
        
        setCurrentConversation({ question, answer: data.data.answer })
        onNewMessage(newMessage)
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.'
      setError(errorMessage)
      setCurrentConversation({
        question,
        answer: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-blue-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Ask me anything to help with your work</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {currentConversation ? (
          <div className="space-y-4">
            {/* User Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-900">{currentConversation.question}</p>
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 rounded-lg p-3">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Thinking...</span>
                    </div>
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">{currentConversation.answer}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Welcome to your AI Assistant</p>
              <p className="text-sm">Type a message below to start a conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        {error && error.includes('blocked') && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Message blocked</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI assistant anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

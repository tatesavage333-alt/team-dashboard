'use client'

import { useState } from 'react'
import { Clock, Save, Check, Bot, User } from 'lucide-react'
import { Message } from '@/types'

interface RecentMessagesProps {
  messages: Message[]
  onSaveToKnowledgeBase: (messageId: string, title?: string, tags?: string[], category?: string) => Promise<boolean>
}

export default function RecentMessages({ messages, onSaveToKnowledgeBase }: RecentMessagesProps) {
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleSave = async (messageId: string) => {
    setSavingId(messageId)
    try {
      const success = await onSaveToKnowledgeBase(messageId)
      if (!success) {
        // Handle error - could show a toast notification
        console.error('Failed to save message')
      }
    } finally {
      setSavingId(null)
    }
  }

  const formatTime = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        return 'Invalid time'
      }
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting time:', error)
      return 'Invalid time'
    }
  }

  const formatDate = (date: Date | string) => {
    try {
      const messageDate = typeof date === 'string' ? new Date(date) : new Date(date)
      if (isNaN(messageDate.getTime())) {
        return 'Invalid date'
      }

      const today = new Date()

      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today'
      }

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday'
      }

      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">{messages.length} conversations</p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation with the AI assistant</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(message.createdAt)}</span>
                    <span>•</span>
                    <span>{formatTime(message.createdAt)}</span>
                  </div>
                  
                  {message.knowledgeBaseEntry ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      <Check className="w-3 h-3" />
                      Saved
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSave(message.id)}
                      disabled={savingId === message.id}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      {savingId === message.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" />
                          Save
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Question */}
                <div className="flex items-start gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-900 line-clamp-2">{message.question}</p>
                </div>

                {/* Answer */}
                <div className="flex items-start gap-2">
                  <Bot className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 line-clamp-3">{message.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

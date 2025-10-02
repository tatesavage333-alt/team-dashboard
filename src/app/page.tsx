'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import RecentMessages from '@/components/RecentMessages'
import KnowledgeBaseSidebar from '@/components/KnowledgeBaseSidebar'
import { Message, KnowledgeBaseEntry } from '@/types'

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    loadMessages()
    loadKnowledgeBase()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages?limit=20')
      const data = await response.json()
      if (data.success) {
        // Convert date strings to Date objects
        const messagesWithDates = data.data.map((message: any) => ({
          ...message,
          createdAt: new Date(message.createdAt),
          updatedAt: new Date(message.updatedAt)
        }))
        setMessages(messagesWithDates)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadKnowledgeBase = async () => {
    try {
      const response = await fetch('/api/knowledge-base')
      const data = await response.json()
      if (data.success) {
        // Convert date strings to Date objects
        const entriesWithDates = data.data.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt)
        }))
        setKnowledgeBase(entriesWithDates)
      }
    } catch (error) {
      console.error('Failed to load knowledge base:', error)
    }
  }

  const handleNewMessage = (newMessage: Message) => {
    setMessages(prev => [newMessage, ...prev])
  }

  const handleSaveToKnowledgeBase = async (messageId: string, title?: string, tags?: string[], category?: string) => {
    try {
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          title,
          tags,
          category
        })
      })

      const data = await response.json()
      if (data.success) {
        setKnowledgeBase(prev => [data.data, ...prev])
        // Update the message to show it's saved
        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, knowledgeBaseEntry: data.data }
            : msg
        ))
        return true
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Failed to save to knowledge base:', error)
      return false
    }
  }

  const handleTogglePin = async (entryId: string, isPinned: boolean) => {
    try {
      const response = await fetch(`/api/knowledge-base/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPinned
        })
      })

      const data = await response.json()
      if (data.success) {
        // Update the knowledge base state
        setKnowledgeBase(prev => prev.map(entry =>
          entry.id === entryId
            ? { ...entry, isPinned }
            : entry
        ))
        return true
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error)
      return false
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
              <p className="text-sm text-gray-600">AI Assistant & Knowledge Base</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface - Main Area */}
          <div className="lg:col-span-2">
            <ChatInterface onNewMessage={handleNewMessage} />
          </div>

          {/* Recent Messages */}
          <div className="lg:col-span-1">
            <RecentMessages
              messages={messages}
              onSaveToKnowledgeBase={handleSaveToKnowledgeBase}
            />
          </div>

          {/* Knowledge Base Sidebar */}
          <div className="lg:col-span-1">
            <KnowledgeBaseSidebar
              entries={knowledgeBase}
              onRefresh={loadKnowledgeBase}
              onTogglePin={handleTogglePin}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { BookOpen, Search, Pin, Tag, RefreshCw } from 'lucide-react'
import { KnowledgeBaseEntry } from '@/types'

interface KnowledgeBaseSidebarProps {
  entries: KnowledgeBaseEntry[]
  onRefresh: () => void
  onTogglePin?: (entryId: string, isPinned: boolean) => Promise<boolean>
}

export default function KnowledgeBaseSidebar({ entries, onRefresh, onTogglePin }: KnowledgeBaseSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [togglingPin, setTogglingPin] = useState<string | null>(null)

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.title && entry.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesPinned = !showPinnedOnly || entry.isPinned
    
    return matchesSearch && matchesPinned
  })

  const pinnedEntries = filteredEntries.filter(entry => entry.isPinned)
  const regularEntries = filteredEntries.filter(entry => !entry.isPinned)

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date'
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: new Date().getFullYear() !== dateObj.getFullYear() ? 'numeric' : undefined
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  const parseTags = (tagsString?: string | null): string[] => {
    if (!tagsString) return []
    try {
      return JSON.parse(tagsString)
    } catch {
      return []
    }
  }

  const handleTogglePin = async (entryId: string, currentPinned: boolean) => {
    if (!onTogglePin) return

    setTogglingPin(entryId)
    try {
      const success = await onTogglePin(entryId, !currentPinned)
      if (success) {
        onRefresh() // Refresh the list to show updated state
      }
    } finally {
      setTogglingPin(null)
    }
  }

  const EntryCard = ({ entry }: { entry: KnowledgeBaseEntry }) => (
    <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          {entry.title && (
            <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
              {entry.title}
            </h4>
          )}
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {entry.question}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {onTogglePin && (
            <button
              onClick={() => handleTogglePin(entry.id, entry.isPinned)}
              disabled={togglingPin === entry.id}
              className={`p-1 rounded transition-colors ${
                entry.isPinned
                  ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              } ${togglingPin === entry.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={entry.isPinned ? 'Unpin entry' : 'Pin entry'}
            >
              {togglingPin === entry.id ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
              ) : (
                <Pin className="w-3 h-3" />
              )}
            </button>
          )}
          {entry.isPinned && !onTogglePin && (
            <Pin className="w-3 h-3 text-yellow-500" />
          )}
        </div>
      </div>

      <p className="text-xs text-gray-700 line-clamp-2 mb-2">
        {entry.answer}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(entry.createdAt)}</span>
        {entry.category && (
          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
            {entry.category}
          </span>
        )}
      </div>

      {parseTags(entry.tags).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {parseTags(entry.tags).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs"
            >
              <Tag className="w-2 h-2" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
          </div>
          <button
            onClick={onRefresh}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              showPinnedOnly
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Pin className="w-3 h-3" />
            Pinned Only
          </button>
          <span className="text-xs text-gray-500">
            {filteredEntries.length} entries
          </span>
        </div>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {entries.length === 0 ? 'No saved entries' : 'No matches found'}
              </p>
              <p className="text-sm">
                {entries.length === 0 
                  ? 'Save conversations to build your knowledge base'
                  : 'Try adjusting your search or filters'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Pinned Entries */}
            {pinnedEntries.length > 0 && !showPinnedOnly && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 mb-2">
                  <Pin className="w-4 h-4" />
                  Pinned
                </div>
                {pinnedEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
                {regularEntries.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Recent</div>
                  </div>
                )}
              </>
            )}

            {/* Regular Entries */}
            {(showPinnedOnly ? pinnedEntries : regularEntries).map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

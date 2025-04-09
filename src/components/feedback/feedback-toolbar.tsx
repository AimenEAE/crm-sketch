'use client'

import React from 'react'
import { MessageSquarePlus, Check, MessageSquare, X } from 'lucide-react'
import { useFeedback } from './feedback-context'
import { Button } from '@/components/ui/button'

export function FeedbackToolbar() {
  const { comments, isFeedbackMode, toggleFeedbackMode } = useFeedback()
  
  // Calculate comment stats
  const totalComments = comments.length
  const resolvedComments = comments.filter(c => c.resolved).length
  const activeComments = totalComments - resolvedComments
  
  // Get current page path for filtering comments
  const currentPage = typeof window !== 'undefined' ? window.location.pathname : ''
  const pageComments = comments.filter(c => c.page === currentPage)
  const pageActiveComments = pageComments.filter(c => !c.resolved).length

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 ${isFeedbackMode ? 'bg-blue-50 p-3 rounded-lg shadow-md border border-blue-200' : ''}`}>
      {isFeedbackMode && (
        <div className="flex flex-col items-end mr-2">
          <div className="text-sm font-medium mb-1">Feedback Mode</div>
          <div className="text-xs text-muted-foreground">Click anywhere to add a comment</div>
        </div>
      )}
      
      {isFeedbackMode && (
        <div className="flex items-center gap-2 mr-2">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs border">
            <MessageSquare size={14} className="text-amber-500" />
            <span>{pageActiveComments} on this page</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs border">
            <Check size={14} className="text-green-500" />
            <span>{resolvedComments} resolved</span>
          </div>
        </div>
      )}
      
      <Button
        onClick={toggleFeedbackMode}
        size="sm"
        className={`rounded-full w-10 h-10 p-0 flex items-center justify-center ${
          isFeedbackMode 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isFeedbackMode ? (
          <X size={16} />
        ) : (
          <MessageSquarePlus size={16} />
        )}
      </Button>
    </div>
  )
} 
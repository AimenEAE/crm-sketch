'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useFeedback } from './feedback-context'
import { CommentBubble } from './comment-bubble'
import { FeedbackToolbar } from './feedback-toolbar'

export function FeedbackOverlay() {
  const { comments, addComment, isFeedbackMode } = useFeedback()
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [targetElement, setTargetElement] = useState<string | null>(null)
  
  // Get current page path using usePathname hook
  const currentPage = usePathname()
  
  // Filter comments for current page
  const pageComments = comments.filter(comment => comment.page === currentPage)

  const handleClick = (e: MouseEvent) => {
    if (!isFeedbackMode || isAddingComment) return
    
    // Prevent click on comment bubbles
    if ((e.target as HTMLElement).closest('[data-feedback-bubble]')) {
      return
    }
    
    // Prevent clicking on the toolbar
    if ((e.target as HTMLElement).closest('[data-feedback-toolbar]')) {
      return
    }
    
    // Get the clicked element
    const element = e.target as HTMLElement
    const elementId = element.id || `el-${Math.random().toString(36).substring(2, 9)}`
    
    // If element doesn't have an ID, assign one
    if (!element.id) {
      element.id = elementId
    }
    
    setClickPosition({ x: e.pageX, y: e.pageY })
    setTargetElement(elementId)
    setIsAddingComment(true)
  }

  const handleSubmitComment = () => {
    if (commentText.trim() && targetElement) {
      addComment({
        elementId: targetElement,
        text: commentText,
        position: clickPosition,
        resolved: false,
        page: currentPage,
      })
      setCommentText('')
      setIsAddingComment(false)
    }
  }

  const handleCancelComment = () => {
    setCommentText('')
    setIsAddingComment(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
    if (e.key === 'Escape') {
      handleCancelComment()
    }
  }

  // Add/remove click event listener
  useEffect(() => {
    if (isFeedbackMode) {
      document.body.style.cursor = 'crosshair'
      document.addEventListener('click', handleClick)
    } else {
      document.body.style.cursor = ''
      document.removeEventListener('click', handleClick)
      setIsAddingComment(false)
    }
    
    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('click', handleClick)
    }
  }, [isFeedbackMode, isAddingComment])

  return (
    <>
      {/* Render existing comments */}
      {pageComments.map(comment => (
        <div key={comment.id} data-feedback-bubble>
          <CommentBubble comment={comment} />
        </div>
      ))}
      
      {/* Comment input form */}
      {isAddingComment && (
        <div 
          className="absolute z-50 max-w-[300px] shadow-lg rounded-lg bg-white border border-blue-500"
          style={{ left: `${clickPosition.x}px`, top: `${clickPosition.y}px` }}
          data-feedback-bubble
        >
          <div className="p-3">
            <textarea
              autoFocus
              className="w-full p-2 border rounded-md text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your feedback here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancelComment}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Comment
              </button>
            </div>
          </div>
          <div className="w-3 h-3 bg-white absolute -left-1.5 top-3 transform rotate-45 border-l border-t border-blue-500"></div>
        </div>
      )}
      
      {/* Toolbar */}
      <div data-feedback-toolbar>
        <FeedbackToolbar />
      </div>
    </>
  )
} 
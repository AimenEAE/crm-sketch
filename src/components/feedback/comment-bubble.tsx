'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Check, Pencil, Trash2 } from 'lucide-react'
import { FeedbackComment, useFeedback } from './feedback-context'

interface CommentBubbleProps {
  comment: FeedbackComment
}

export function CommentBubble({ comment }: CommentBubbleProps) {
  const { updateComment, deleteComment, resolveComment } = useFeedback()
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(comment.text)
  const [showActions, setShowActions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(text.length, text.length)
    }
  }, [isEditing, text])

  const handleSave = () => {
    if (text.trim()) {
      updateComment(comment.id, text)
    }
    setIsEditing(false)
  }

  const handleResolve = () => {
    resolveComment(comment.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      setText(comment.text)
      setIsEditing(false)
    }
  }

  // Format date to be more readable
  const formattedDate = new Date(comment.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`absolute z-50 max-w-[300px] shadow-lg rounded-lg bg-white border ${
        comment.resolved ? 'border-green-500 bg-green-50' : 'border-amber-500'
      }`}
      style={{ 
        left: `${comment.position.x}px`, 
        top: `${comment.position.y}px`,
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-muted-foreground">{formattedDate}</div>
          {(showActions || isEditing) && !comment.resolved && (
            <div className="flex items-center gap-1">
              {!isEditing && (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={handleResolve}
                    className="p-1 hover:bg-green-100 rounded-full text-green-600"
                  >
                    <Check size={14} />
                  </button>
                </>
              )}
              <button 
                onClick={() => deleteComment(comment.id)}
                className="p-1 hover:bg-red-100 rounded-full text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
          {comment.resolved && (
            <div className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">Resolved</div>
          )}
        </div>
        
        {isEditing ? (
          <div>
            <textarea
              ref={textareaRef}
              className="w-full p-2 border rounded-md text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setText(comment.text)
                  setIsEditing(false)
                }}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm whitespace-pre-wrap">{comment.text}</div>
        )}
      </div>
      <div 
        className={`w-3 h-3 bg-white absolute -left-1.5 top-3 transform rotate-45 border-l border-t ${
          comment.resolved ? 'border-green-500 bg-green-50' : 'border-amber-500'
        }`}
      ></div>
    </div>
  )
} 
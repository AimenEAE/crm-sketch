'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the structure of a feedback comment
export interface FeedbackComment {
  id: string
  elementId: string
  text: string
  position: { x: number; y: number }
  createdAt: string
  resolved: boolean
  page: string
}

interface FeedbackContextType {
  comments: FeedbackComment[]
  addComment: (comment: Omit<FeedbackComment, 'id' | 'createdAt'>) => void
  updateComment: (id: string, text: string) => void
  deleteComment: (id: string) => void
  resolveComment: (id: string) => void
  isFeedbackMode: boolean
  toggleFeedbackMode: () => void
}

const FeedbackContext = createContext<FeedbackContextType | null>(null)

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}

interface FeedbackProviderProps {
  children: ReactNode
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const [comments, setComments] = useState<FeedbackComment[]>([])
  const [isFeedbackMode, setIsFeedbackMode] = useState(false)

  // Load comments from localStorage on mount
  useEffect(() => {
    const storedComments = localStorage.getItem('feedbackComments')
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments))
      } catch (error) {
        console.error('Error parsing stored comments:', error)
      }
    }
  }, [])

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('feedbackComments', JSON.stringify(comments))
  }, [comments])

  // Add a new comment
  const addComment = (comment: Omit<FeedbackComment, 'id' | 'createdAt'>) => {
    const newComment: FeedbackComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    setComments((prev) => [...prev, newComment])
  }

  // Update an existing comment
  const updateComment = (id: string, text: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, text } : comment
      )
    )
  }

  // Delete a comment
  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id))
  }

  // Mark a comment as resolved
  const resolveComment = (id: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, resolved: true } : comment
      )
    )
  }

  // Toggle feedback mode
  const toggleFeedbackMode = () => {
    setIsFeedbackMode((prev) => !prev)
  }

  return (
    <FeedbackContext.Provider
      value={{
        comments,
        addComment,
        updateComment,
        deleteComment,
        resolveComment,
        isFeedbackMode,
        toggleFeedbackMode,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
} 
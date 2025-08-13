'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  DocumentTextIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { cn, calculateWordCount } from '@/lib/utils'
import { useBattle } from '@/lib/battleStore'

export default function StoryEditor({ 
  className = '',
  placeholder = 'Start writing your story...',
  autoFocus = true 
}) {
  const { state, actions, computed } = useBattle()
  const [localContent, setLocalContent] = useState('')
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving', 'saved', 'error'
  const textareaRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  // Sync with battle state
  useEffect(() => {
    setLocalContent(state.story)
  }, [state.story])

  // Auto-focus when component mounts
  useEffect(() => {
    if (autoFocus && textareaRef.current && state.phase === 'writing') {
      textareaRef.current.focus()
    }
  }, [autoFocus, state.phase])

  // Auto-save with debouncing
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    setSaveStatus('saving')
    
    saveTimeoutRef.current = setTimeout(() => {
      const wordCount = calculateWordCount(localContent)
      actions.updateStory(localContent, wordCount)
      setSaveStatus('saved')
    }, 1000) // 1 second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [localContent, actions])

  const handleContentChange = (e) => {
    const newContent = e.target.value
    
    // Check word limit
    const wordCount = calculateWordCount(newContent)
    const maxWords = state.format?.maxWords || 1000
    
    if (wordCount <= maxWords) {
      setLocalContent(newContent)
    }
  }

  const handleSubmit = () => {
    if (localContent.trim() && !state.hasSubmitted) {
      actions.submitStory()
    }
  }

  const wordCount = calculateWordCount(localContent)
  const maxWords = state.format?.maxWords || 1000
  const isNearLimit = wordCount >= maxWords * 0.9
  const isOverLimit = wordCount > maxWords
  const canSubmit = localContent.trim().length > 0 && !state.hasSubmitted && state.phase === 'writing'

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse" />
      case 'saved':
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getWordCountColor = () => {
    if (isOverLimit) return 'text-red-400'
    if (isNearLimit) return 'text-orange-400'
    return 'text-gray-400'
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-5 w-5 text-purple-400" />
          <span className="font-medium text-white">Your Story</span>
          {state.hasSubmitted && (
            <Badge className="bg-green-600 text-white">
              Submitted
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Save Status */}
          <div className="flex items-center space-x-2 text-sm">
            {getSaveStatusIcon()}
            <span className="text-gray-400">
              {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </span>
          </div>

          {/* Word Count */}
          <div className="flex items-center space-x-2">
            <span className={cn('text-sm font-mono', getWordCountColor())}>
              {wordCount}/{maxWords}
            </span>
            {isNearLimit && (
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-400" />
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleContentChange}
          placeholder={placeholder}
          disabled={state.hasSubmitted || state.phase !== 'writing'}
          className={cn(
            'h-full min-h-[400px] resize-none border-0 bg-transparent text-white',
            'placeholder:text-gray-500 focus:ring-0 focus:border-0',
            'text-lg leading-relaxed p-6',
            state.hasSubmitted && 'opacity-75 cursor-not-allowed'
          )}
        />

        {/* Writing Indicators */}
        {state.phase === 'writing' && !state.hasSubmitted && (
          <motion.div
            className="absolute top-4 right-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="h-2 w-2 bg-green-400 rounded-full" />
              <span>Writing...</span>
            </div>
          </motion.div>
        )}

        {/* Submission Overlay */}
        {state.hasSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Story Submitted!</h3>
              <p className="text-gray-400">
                Waiting for other participants to finish...
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          
          {/* Format Info */}
          <div className="text-sm text-gray-400">
            <span className="font-medium text-purple-400">{state.format?.name}</span>
            {state.format?.description && (
              <span className="ml-2">• {state.format.description}</span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'min-w-[120px]',
              canSubmit 
                ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            )}
          >
            {state.hasSubmitted ? (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Submitted
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Submit Story
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round((wordCount / maxWords) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={cn(
                'h-2 rounded-full transition-colors',
                isOverLimit 
                  ? 'bg-red-400' 
                  : isNearLimit 
                    ? 'bg-orange-400' 
                    : 'bg-purple-400'
              )}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((wordCount / maxWords) * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Warning Messages */}
        {isNearLimit && !isOverLimit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center space-x-2 text-sm text-orange-400"
          >
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Approaching word limit</span>
          </motion.div>
        )}

        {isOverLimit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center space-x-2 text-sm text-red-400"
          >
            <XCircleIcon className="h-4 w-4" />
            <span>Word limit exceeded - please edit your story</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
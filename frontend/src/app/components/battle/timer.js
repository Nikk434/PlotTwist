'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export default function Timer({ 
  initialTime = 1200, // 20 minutes in seconds
  isActive = false,
  onTimeUp = () => {},
  onWarning = () => {},
  warningThreshold = 300, // 5 minutes
  criticalThreshold = 60, // 1 minute
  size = 'default', // 'small', 'default', 'large'
  showProgress = true,
  className = ''
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isWarning, setIsWarning] = useState(false)
  const [isCritical, setIsCritical] = useState(false)

  useEffect(() => {
    setTimeLeft(initialTime)
  }, [initialTime])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1

        // Check for warning threshold
        if (newTime === warningThreshold && !isWarning) {
          setIsWarning(true)
          onWarning('warning')
        }

        // Check for critical threshold
        if (newTime === criticalThreshold && !isCritical) {
          setIsCritical(true)
          onWarning('critical')
        }

        // Time's up
        if (newTime <= 0) {
          onTimeUp()
          return 0
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, warningThreshold, criticalThreshold, isWarning, isCritical, onTimeUp, onWarning])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (isCritical) return 'text-red-400'
    if (isWarning) return 'text-orange-400'
    return 'text-green-400'
  }

  const getBackgroundColor = () => {
    if (isCritical) return 'bg-red-500/20 border-red-500/30'
    if (isWarning) return 'bg-orange-500/20 border-orange-500/30'
    return 'bg-green-500/20 border-green-500/30'
  }

  const progressPercentage = (timeLeft / initialTime) * 100

  const sizeClasses = {
    small: 'text-sm px-3 py-1',
    default: 'text-lg px-4 py-2',
    large: 'text-2xl px-6 py-3'
  }

  const iconSizes = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  }

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center space-x-2 rounded-lg border backdrop-blur-sm',
        getBackgroundColor(),
        sizeClasses[size],
        className
      )}
      animate={isCritical ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
    >
      {/* Progress Bar Background */}
      {showProgress && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-lg transition-colors duration-300',
              isCritical ? 'bg-red-500/10' : isWarning ? 'bg-orange-500/10' : 'bg-green-500/10'
            )}
            initial={{ width: '100%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Timer Content */}
      <div className="relative flex items-center space-x-2">
        {isCritical ? (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <ExclamationTriangleIcon className={cn(iconSizes[size], 'text-red-400')} />
          </motion.div>
        ) : (
          <ClockIcon className={cn(iconSizes[size], getTimeColor())} />
        )}

        <span className={cn('font-mono font-bold', getTimeColor())}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Pulse Effect for Critical Time */}
      {isCritical && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-red-400"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

// Preset timer configurations
export const TimerPresets = {
  STORY_SPRINT: {
    initialTime: 1200, // 20 minutes
    warningThreshold: 300, // 5 minutes
    criticalThreshold: 60 // 1 minute
  },
  DIALOGUE_DUEL: {
    initialTime: 900, // 15 minutes
    warningThreshold: 180, // 3 minutes
    criticalThreshold: 60 // 1 minute
  },
  CHARACTER_BACKSTORY: {
    initialTime: 1500, // 25 minutes
    warningThreshold: 300, // 5 minutes
    criticalThreshold: 120 // 2 minutes
  },
  SCREENPLAY_BATTLE: {
    initialTime: 5400, // 90 minutes
    warningThreshold: 900, // 15 minutes
    criticalThreshold: 300 // 5 minutes
  }
}
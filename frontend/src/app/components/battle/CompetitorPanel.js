'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  UsersIcon,
  EyeIcon,
  CheckCircleIcon,
  PencilIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useBattle } from '@/lib/battleStore'

const statusColors = {
  writing: 'text-blue-400 bg-blue-500/20',
  submitted: 'text-green-400 bg-green-500/20',
  reviewing: 'text-purple-400 bg-purple-500/20',
  waiting: 'text-gray-400 bg-gray-500/20'
}

const statusIcons = {
  writing: PencilIcon,
  submitted: CheckCircleIcon,
  reviewing: EyeIcon,
  waiting: ClockIcon
}

function CompetitorCard({ participant, isCurrentUser = false, rank = null }) {
  const StatusIcon = statusIcons[participant.status] || ClockIcon
  const statusColorClass = statusColors[participant.status] || statusColors.waiting

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-4 rounded-lg border backdrop-blur-sm transition-all',
        isCurrentUser 
          ? 'bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/20' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          
          {/* Rank Badge */}
          {rank && (
            <Badge className="h-6 w-6 p-0 rounded-full bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {rank}
            </Badge>
          )}

          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarImage src={participant.avatar} alt={participant.username} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                {participant.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Online status */}
            <div className={cn(
              'absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-black',
              participant.isOnline ? 'bg-green-400' : 'bg-gray-500'
            )} />
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={cn(
                'font-medium truncate',
                isCurrentUser ? 'text-purple-400' : 'text-white'
              )}>
                {participant.username}
                {isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
              </span>
              {participant.rating && (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  {participant.rating}
                </Badge>
              )}
            </div>
            
            {/* Status */}
            <div className="flex items-center space-x-1 mt-1">
              <StatusIcon className="h-3 w-3" />
              <span className={cn('text-xs capitalize', statusColorClass.split(' ')[0])}>
                {participant.status || 'waiting'}
              </span>
            </div>
          </div>
        </div>

        {/* Trophy for winner */}
        {participant.isWinner && (
          <TrophyIcon className="h-5 w-5 text-yellow-400" />
        )}
      </div>

      {/* Progress Bar */}
      {participant.progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Progress</span>
            <span className={cn(
              'font-medium',
              participant.progress >= 100 ? 'text-green-400' : 'text-gray-400'
            )}>
              {Math.round(participant.progress)}%
            </span>
          </div>
          
          <Progress 
            value={participant.progress} 
            className="h-2 bg-gray-700"
            // Custom progress color based on completion
            style={{
              '--progress-background': participant.progress >= 100 
                ? 'rgb(34 197 94)' // green-500
                : 'rgb(139 92 246)' // purple-500
            }}
          />
          
          {participant.wordCount !== undefined && (
            <div className="text-xs text-gray-500">
              {participant.wordCount} words
            </div>
          )}
        </div>
      )}

      {/* Score (if available) */}
      {participant.score !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Final Score</span>
            <Badge className={cn(
              'font-bold',
              participant.score >= 80 ? 'bg-green-600' : 
              participant.score >= 60 ? 'bg-yellow-600' : 'bg-gray-600'
            )}>
              {participant.score}/100
            </Badge>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function CompetitorPanel({ 
  className = '',
  showSpectators = true 
}) {
  const { state, computed } = useBattle()
  
  return (
    <div className={cn('space-y-4', className)}>
      
      {/* Panel Header */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-purple-400" />
            <span className="font-semibold text-white">Competitors</span>
            <Badge variant="outline" className="text-xs">
              {state.participants.length}/{state.maxParticipants}
            </Badge>
          </div>
          
          {showSpectators && state.spectatorCount > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <EyeIcon className="h-4 w-4" />
              <span>{state.spectatorCount} watching</span>
            </div>
          )}
        </div>
      </Card>

      {/* Competitors List */}
      <div className="space-y-3">
        {computed.participantProgress.map((participant, index) => (
          <CompetitorCard
            key={participant.id}
            participant={participant}
            isCurrentUser={participant.id === state.currentUser?.id}
            rank={state.phase === 'results' ? participant.rank : null}
          />
        ))}
        
        {/* Empty Slots */}
        {state.participants.length < state.maxParticipants && state.phase === 'lobby' && (
          Array.from({ length: state.maxParticipants - state.participants.length }).map((_, index) => (
            <motion.div
              key={`empty-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/20"
            >
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <UsersIcon className="h-5 w-5" />
                <span className="text-sm">Waiting for participant...</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Live Activity Feed */}
      {state.phase === 'writing' && (
        <Card className="p-4 bg-black/20 border-white/10">
          <h4 className="font-medium text-white mb-3 text-sm">Live Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {/* Mock activity items - would be real-time updates */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-gray-400 flex items-center space-x-2"
            >
              <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
              <span><span className="text-white">Alex</span> just submitted their story</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-gray-400 flex items-center space-x-2"
            >
              <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span><span className="text-white">Sarah</span> is writing...</span>
            </motion.div>
          </div>
        </Card>
      )}

      {/* Battle Stats */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="font-medium text-white mb-3 text-sm">Battle Stats</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-400">
              {state.participants.filter(p => p.status === 'submitted').length}
            </div>
            <div className="text-xs text-gray-400">Submitted</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">
              {state.participants.filter(p => p.status === 'writing').length}
            </div>
            <div className="text-xs text-gray-400">Writing</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
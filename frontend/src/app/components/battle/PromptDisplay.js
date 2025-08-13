'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LightBulbIcon,
  UserIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon,
  FilmIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useBattle } from '@/lib/battleStore'

const genreColors = {
  horror: 'bg-red-500/20 border-red-500/30 text-red-400',
  comedy: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  romance: 'bg-pink-500/20 border-pink-500/30 text-pink-400',
  thriller: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
  'sci-fi': 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  drama: 'bg-purple-500/20 border-purple-500/30 text-purple-400'
}

const genreIcons = {
  horror: '👻',
  comedy: '😂',
  romance: '💕',
  thriller: '🔥',
  'sci-fi': '🚀',
  drama: '🎭'
}

export default function PromptDisplay({ 
  className = '',
  isSticky = false,
  showProgress = true 
}) {
  const { state, computed } = useBattle()
  
  if (!state.prompt) {
    return (
      <Card className={cn('p-6 bg-black/20 border-white/10', className)}>
        <div className="text-center text-gray-400">
          <LightBulbIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Waiting for challenge prompt...</p>
        </div>
      </Card>
    )
  }

  const { character, prop, line, genre } = state.requiredElements || {}
  const genreColorClass = genreColors[genre] || genreColors.drama

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'space-y-4',
        isSticky && 'sticky top-20',
        className
      )}
    >
      
      {/* Main Prompt Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-black/30 border-purple-500/20 backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <LightBulbIcon className="h-5 w-5 text-purple-400" />
            <span className="font-semibold text-white">Challenge Prompt</span>
          </div>
          
          {/* Genre Badge */}
          {genre && (
            <Badge className={cn('border', genreColorClass)}>
              <span className="mr-1">{genreIcons[genre]}</span>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </Badge>
          )}
        </div>

        {/* Prompt Text */}
        <div className="mb-6">
          <p className="text-lg text-gray-200 leading-relaxed">
            {state.prompt}
          </p>
        </div>

        {/* Required Elements */}
        {(character || prop || line) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Required Elements
            </h4>
            
            <div className="grid gap-3">
              
              {/* Character */}
              {character && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <UserIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-blue-400">Character</div>
                    <div className="text-white">{character}</div>
                  </div>
                </motion.div>
              )}

              {/* Prop */}
              {prop && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <CubeIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-green-400">Prop</div>
                    <div className="text-white">{prop}</div>
                  </div>
                </motion.div>
              )}

              {/* Line */}
              {line && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-orange-400">Required Dialogue</div>
                    <div className="text-white italic">"{line}"</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Battle Format Info */}
      {state.format && (
        <Card className="p-4 bg-black/20 border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FilmIcon className="h-4 w-4 text-purple-400" />
              <span className="font-medium text-purple-400">{state.format.name}</span>
            </div>
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              Max {state.format.maxWords} words
            </Badge>
          </div>
          
          {state.format.description && (
            <p className="text-sm text-gray-400 mt-2">{state.format.description}</p>
          )}
        </Card>
      )}

      {/* Progress Indicator */}
      {showProgress && state.phase === 'writing' && (
        <Card className="p-4 bg-black/20 border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">Battle Progress</span>
            <span className="text-sm text-gray-400">
              {Math.round(computed.timeProgress * 100)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${computed.timeProgress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Started</span>
            <span>Complete</span>
          </div>
        </Card>
      )}

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/20">
          <div className="flex items-start space-x-2">
            <LightBulbIcon className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-1">Pro Tip</h4>
              <p className="text-xs text-gray-300">
                Focus on strong character voice and clear conflict. 
                Use all required elements naturally within your story.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
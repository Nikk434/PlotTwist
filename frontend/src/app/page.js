'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
// import Header from '@/components/layout/header'
import Header from './components/layout/header'
import BattleInterface from './components/battle/BattleInterface'
import { BattleProvider } from '@/lib/battleStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  WifiIcon 
} from '@heroicons/react/24/outline'

// Loading component for battle
function BattleLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-16 w-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 h-16 w-16 border-4 border-purple-400/30 rounded-full mx-auto"
          />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Joining Battle</h2>
        <p className="text-gray-400">Connecting to the arena...</p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-6 max-w-xs mx-auto"
        />
      </motion.div>
    </div>
  )
}

// Error component for battle
function BattleError({ error, onRetry, onGoBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 text-center max-w-md battle-card">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          
          <h2 className="text-2xl font-bold text-white mb-4">Battle Error</h2>
          
          <p className="text-gray-400 mb-6">
            {error?.message || 'Unable to connect to the battle. Please check your connection and try again.'}
          </p>
          
          <div className="flex space-x-3">
            <Button
              onClick={onRetry}
              className="flex-1 bg-purple-600 hover:bg-purple-500"
            >
              Try Again
            </Button>
            <Button
              onClick={onGoBack}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-400"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// Connection status indicator
function ConnectionIndicator({ isConnected }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-20 right-4 z-50 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm backdrop-blur-sm ${
        isConnected 
          ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
          : 'bg-red-500/20 border border-red-500/30 text-red-400'
      }`}
    >
      <WifiIcon className="h-4 w-4" />
      <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
    </motion.div>
  )
}

export default function BattlePage() {
  const params = useParams()
  const router = useRouter()
  const battleId = params?.battleId
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null) // TODO: Get from auth context
  const [isConnected, setIsConnected] = useState(false)

  // Mock user data - replace with real auth
  useEffect(() => {
    // TODO: Get user from auth context/JWT
    setUser({
      id: 'user-123',
      username: 'YourUsername',
      avatar: null,
      rating: 1250
    })
  }, [])

  // Initialize battle connection
  useEffect(() => {
    if (!battleId) {
      setError(new Error('Invalid battle ID'))
      setIsLoading(false)
      return
    }

    // Simulate API call to join battle
    const initializeBattle = async () => {
      try {
        setIsLoading(true)
        
        // TODO: Replace with real API call
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate loading
        
        // Mock success
        setIsConnected(true)
        setIsLoading(false)
        
      } catch (err) {
        console.error('Failed to initialize battle:', err)
        setError(err)
        setIsLoading(false)
      }
    }

    initializeBattle()
  }, [battleId])

  // Handle retry
  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    // Re-trigger initialization
    window.location.reload()
  }

  // Handle go back
  const handleGoBack = () => {
    router.push('/dashboard')
  }

  // Validate battle ID format
  if (!battleId || typeof battleId !== 'string') {
    return (
      <BattleError 
        error={new Error('Invalid battle ID format')}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    )
  }

  // Show loading state
  if (isLoading) {
    return <BattleLoading />
  }

  // Show error state
  if (error) {
    return (
      <BattleError 
        error={error}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    )
  }

  // Main battle interface
  return (
    <BattleProvider user={user}>
      <div className="min-h-screen">
        
        {/* Header */}
        <Header 
          user={user} 
          notifications={0} 
        />
        
        {/* Connection Status */}
        <ConnectionIndicator isConnected={isConnected} />
        
        {/* Battle Interface */}
        <Suspense fallback={<BattleLoading />}>
          <BattleInterface 
            battleId={battleId}
          />
        </Suspense>
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>
    </BattleProvider>
  )
}

// Export metadata for the page
// export const metadata = {
//   title: 'Battle Arena - PlotTwist',
//   description: 'Compete in real-time creative writing battles',
// }
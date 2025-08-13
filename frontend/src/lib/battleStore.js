'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

// Battle States
export const BATTLE_PHASES = {
  LOBBY: 'lobby',
  COUNTDOWN: 'countdown', 
  WRITING: 'writing',
  REVIEWING: 'reviewing',
  RESULTS: 'results'
}

export const BATTLE_FORMATS = {
  STORY_SPRINT: {
    id: 'story_sprint',
    name: 'Story Sprint',
    duration: 1200, // 20 minutes
    description: 'Write an engaging opening scene',
    maxWords: 500
  },
  DIALOGUE_DUEL: {
    id: 'dialogue_duel', 
    name: 'Dialogue Duel',
    duration: 900, // 15 minutes
    description: 'Create a scene using only dialogue',
    maxWords: 300
  },
  CHARACTER_BACKSTORY: {
    id: 'character_backstory',
    name: 'Character Backstory',
    duration: 1500, // 25 minutes
    description: 'Develop a compelling character history',
    maxWords: 600
  }
}

// Initial battle state
const initialState = {
  // Battle Info
  battleId: null,
  phase: BATTLE_PHASES.LOBBY,
  format: null,
  prompt: null,
  requiredElements: {
    character: null,
    prop: null,
    line: null,
    genre: null
  },
  
  // Participants
  participants: [],
  currentUser: null,
  maxParticipants: 4,
  
  // Timer
  timeRemaining: 0,
  totalTime: 0,
  
  // Writing
  story: '',
  wordCount: 0,
  hasSubmitted: false,
  
  // Results
  scores: [],
  winner: null,
  
  // Live Updates
  isConnected: false,
  lastUpdate: null,
  
  // Spectators
  spectatorCount: 0,
  spectatorMode: false
}

// Action types
const ACTION_TYPES = {
  SET_BATTLE_INFO: 'SET_BATTLE_INFO',
  SET_PHASE: 'SET_PHASE',
  SET_PARTICIPANTS: 'SET_PARTICIPANTS',
  ADD_PARTICIPANT: 'ADD_PARTICIPANT',
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
  UPDATE_TIMER: 'UPDATE_TIMER',
  UPDATE_STORY: 'UPDATE_STORY',
  SET_SCORES: 'SET_SCORES',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  UPDATE_SPECTATOR_COUNT: 'UPDATE_SPECTATOR_COUNT',
  SET_SPECTATOR_MODE: 'SET_SPECTATOR_MODE',
  RESET_BATTLE: 'RESET_BATTLE'
}

// Reducer
function battleReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_BATTLE_INFO:
      return {
        ...state,
        battleId: action.payload.battleId,
        format: action.payload.format,
        prompt: action.payload.prompt,
        requiredElements: action.payload.requiredElements,
        totalTime: action.payload.totalTime,
        timeRemaining: action.payload.totalTime,
        maxParticipants: action.payload.maxParticipants || 4
      }

    case ACTION_TYPES.SET_PHASE:
      return {
        ...state,
        phase: action.payload,
        lastUpdate: new Date().toISOString()
      }

    case ACTION_TYPES.SET_PARTICIPANTS:
      return {
        ...state,
        participants: action.payload
      }

    case ACTION_TYPES.ADD_PARTICIPANT:
      return {
        ...state,
        participants: [...state.participants, action.payload]
      }

    case ACTION_TYPES.REMOVE_PARTICIPANT:
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.payload)
      }

    case ACTION_TYPES.UPDATE_TIMER:
      return {
        ...state,
        timeRemaining: action.payload
      }

    case ACTION_TYPES.UPDATE_STORY:
      return {
        ...state,
        story: action.payload.content,
        wordCount: action.payload.wordCount,
        hasSubmitted: action.payload.hasSubmitted || false
      }

    case ACTION_TYPES.SET_SCORES:
      return {
        ...state,
        scores: action.payload.scores,
        winner: action.payload.winner
      }

    case ACTION_TYPES.SET_CONNECTION_STATUS:
      return {
        ...state,
        isConnected: action.payload
      }

    case ACTION_TYPES.UPDATE_SPECTATOR_COUNT:
      return {
        ...state,
        spectatorCount: action.payload
      }

    case ACTION_TYPES.SET_SPECTATOR_MODE:
      return {
        ...state,
        spectatorMode: action.payload
      }

    case ACTION_TYPES.RESET_BATTLE:
      return {
        ...initialState,
        currentUser: state.currentUser
      }

    default:
      return state
  }
}

// Context
const BattleContext = createContext()

// Provider component
export function BattleProvider({ children, user = null }) {
  const [state, dispatch] = useReducer(battleReducer, {
    ...initialState,
    currentUser: user
  })

  // WebSocket connection (placeholder for now)
  useEffect(() => {
    if (state.battleId && !state.spectatorMode) {
      // TODO: Establish WebSocket connection
      console.log('Connecting to battle:', state.battleId)
      dispatch({ type: ACTION_TYPES.SET_CONNECTION_STATUS, payload: true })
      
      return () => {
        // TODO: Cleanup WebSocket connection
        dispatch({ type: ACTION_TYPES.SET_CONNECTION_STATUS, payload: false })
      }
    }
  }, [state.battleId, state.spectatorMode])

  // Actions
  const actions = {
    setBattleInfo: (battleInfo) => {
      dispatch({ type: ACTION_TYPES.SET_BATTLE_INFO, payload: battleInfo })
    },

    setPhase: (phase) => {
      dispatch({ type: ACTION_TYPES.SET_PHASE, payload: phase })
    },

    joinBattle: (participant) => {
      dispatch({ type: ACTION_TYPES.ADD_PARTICIPANT, payload: participant })
    },

    leaveBattle: (participantId) => {
      dispatch({ type: ACTION_TYPES.REMOVE_PARTICIPANT, payload: participantId })
    },

    updateTimer: (timeRemaining) => {
      dispatch({ type: ACTION_TYPES.UPDATE_TIMER, payload: timeRemaining })
    },

    updateStory: (content, wordCount, hasSubmitted = false) => {
      dispatch({ 
        type: ACTION_TYPES.UPDATE_STORY, 
        payload: { content, wordCount, hasSubmitted }
      })
    },

    submitStory: () => {
      dispatch({ 
        type: ACTION_TYPES.UPDATE_STORY, 
        payload: { 
          content: state.story, 
          wordCount: state.wordCount, 
          hasSubmitted: true 
        }
      })
    },

    setResults: (scores, winner) => {
      dispatch({ 
        type: ACTION_TYPES.SET_SCORES, 
        payload: { scores, winner }
      })
    },

    enableSpectatorMode: () => {
      dispatch({ type: ACTION_TYPES.SET_SPECTATOR_MODE, payload: true })
    },

    resetBattle: () => {
      dispatch({ type: ACTION_TYPES.RESET_BATTLE })
    }
  }

  // Computed values
  const computed = {
    isLobbyFull: state.participants.length >= state.maxParticipants,
    canStartBattle: state.participants.length >= 2,
    timeProgress: state.totalTime > 0 ? (state.totalTime - state.timeRemaining) / state.totalTime : 0,
    isTimeWarning: state.timeRemaining <= 300 && state.timeRemaining > 60, // 5 min warning
    isTimeCritical: state.timeRemaining <= 60, // 1 min critical
    participantProgress: state.participants.map(p => ({
      ...p,
      progress: p.wordCount ? Math.min((p.wordCount / state.format?.maxWords) * 100, 100) : 0
    }))
  }

  return (
    <BattleContext.Provider value={{ state, actions, computed }}>
      {children}
    </BattleContext.Provider>
  )
}

// Hook to use battle context
export function useBattle() {
  const context = useContext(BattleContext)
  if (!context) {
    throw new Error('useBattle must be used within a BattleProvider')
  }
  return context
}

// Helper functions
export function generatePrompt(genre, character, prop, line) {
  const prompts = {
    horror: `Write a chilling opening scene where ${character} discovers ${prop}. Include the line: "${line}"`,
    comedy: `Create a hilarious situation involving ${character} and ${prop}. Use the line: "${line}"`,
    romance: `Craft a romantic moment between ${character} and someone special involving ${prop}. Include: "${line}"`,
    thriller: `Build tension as ${character} encounters ${prop} in a dangerous situation. Use: "${line}"`,
    'sci-fi': `Imagine ${character} in a futuristic world discovering ${prop}. Include the line: "${line}"`
  }
  
  return prompts[genre] || `Write a compelling scene featuring ${character} and ${prop}. Include: "${line}"`
}

export function calculateWordCount(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export function formatTimeRemaining(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
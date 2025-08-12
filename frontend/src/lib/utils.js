import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// PlotTwist specific utilities
export const BATTLE_STATES = {
  WAITING: 'waiting',
  ACTIVE: 'active',
  REVIEWING: 'reviewing',
  COMPLETED: 'completed'
}

export const GENRES = {
  HORROR: 'horror',
  COMEDY: 'comedy',
  ROMANCE: 'romance',
  THRILLER: 'thriller',
  SCIFI: 'sci-fi'
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function generateBattleId() {
  return Math.random().toString(36).substring(2, 15)
}
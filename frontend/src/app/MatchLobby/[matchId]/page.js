'use client'
// import MatchLobby from './components/MatchLobby'
import { use } from 'react'
import MatchLobby from "@/app/components/MatchLobby";


export default function MatchLobbyPage({ params }) {
  // Unwrap params using React.use()
  const { matchId } = use(params)
  console.log("MATCHA 2 = = = = ",matchId);
  
  if (!matchId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#ef4444'
      }}>
        Invalid match ID
      </div>
    )
  }

  return <MatchLobby matchId={matchId} />
}
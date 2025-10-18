'use client'
import React, { useState, useEffect } from 'react'

export default function MatchLobby({ matchId }) {
  const [matchData, setMatchData] = useState(null)
  const [participants, setParticipants] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/auth/me', {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          setCurrentUserId(data.profile.user_id)
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }

    // Fetch match data
    const fetchMatchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/match/${matchId}`, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to fetch match')
        
        const data = await res.json()
        setMatchData(data)
        
        // Mock participants with readiness status
        // Replace with actual API call
        setParticipants([
          { 
            userId: data.hostedBy.userId, 
            username: data.hostedBy.username, 
            isReady: true,
            isHost: true 
          }
        ])
        
        // setLoading(false)
        setLoading(true)

      } catch (err) {
        setError(err.message)
        // setLoading(false)
        setLoading(true)

      }
    }

    fetchUser()
    // fetchMatchData()

    // Poll for updates every 2 seconds
    // const interval = setInterval(fetchMatchData, 2000)
    // return () => clearInterval(interval)
  }, [matchId])

  const handleReadyToggle = async () => {
    // Call API to toggle ready status
    try {
      await fetch(`http://localhost:8000/api/match/${matchId}/ready`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReady: !isReady })
      })
      setIsReady(!isReady)
    } catch (err) {
      console.error('Failed to update ready status:', err)
    }
  }

  const handleStartMatch = async () => {
    try {
      await fetch(`http://localhost:8000/api/match/${matchId}/start`, {
        method: 'POST',
        credentials: 'include'
      })
      window.location.href = '/StoryEditor'
    } catch (err) {
      console.error('Failed to start match:', err)
    }
  }

  if (false) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading lobby...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '100px auto', 
        padding: '24px',
        backgroundColor: '#fee2e2',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        color: '#991b1b'
      }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  const isHost = currentUserId === matchData?.hostedBy?.userId
  const readyCount = participants.filter(p => p.isReady).length
  const canStart = isHost && readyCount >= matchData?.participants?.minCount

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '32px', 
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                🎬 Match Lobby
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#6b7280',
                fontFamily: 'monospace'
              }}>
                Match ID: {matchData?._id}
              </p>
            </div>
            <div style={{
              backgroundColor: '#ede9fe',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '2px solid #a78bfa'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                Waiting for players
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7c3aed' }}>
                {readyCount}/{matchData?.participants?.maxCount}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left Column - Match Details */}
          <div>
            {/* Host Info */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                👑 Host
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px'
                }}>
                  {matchData?.hostedBy?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                    {matchData?.hostedBy?.username}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Match Creator
                  </div>
                </div>
              </div>
            </div>

            {/* Match Settings */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                ⚙️ Match Settings
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <SettingItem 
                  icon="⏱️" 
                  label="Time Limit" 
                  value={`${matchData?.timeLimit} minutes`} 
                />
                <SettingItem 
                  icon="🎭" 
                  label="Genres" 
                  value={matchData?.genres?.join(', ')} 
                />
                <SettingItem 
                  icon="📝" 
                  label="Prompt Type" 
                  value={matchData?.promptType} 
                />
                {matchData?.wordCap && (
                  <SettingItem 
                    icon="📊" 
                    label="Word Limit" 
                    value={`${matchData.wordCap} words`} 
                  />
                )}
                {matchData?.objectInclusion && (
                  <SettingItem 
                    icon="🎯" 
                    label="Must Include" 
                    value={`"${matchData.objectInclusion}"`} 
                  />
                )}
                {matchData?.reverseChallenge && (
                  <SettingItem 
                    icon="🔄" 
                    label="Special" 
                    value="Reverse Challenge" 
                  />
                )}
              </div>

              {/* Prompt Preview */}
              {!matchData?.isBlindPrompt && matchData?.promptText && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  borderLeft: '4px solid #8b5cf6'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    PROMPT
                  </div>
                  <div style={{ fontSize: '14px', color: '#1e293b' }}>
                    {matchData.promptText}
                  </div>
                </div>
              )}

              {matchData?.isBlindPrompt && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#92400e' }}>
                    Blind Challenge
                  </div>
                  <div style={{ fontSize: '12px', color: '#78350f' }}>
                    Prompt will be revealed when match starts
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Participants */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: '#1e293b'
                }}>
                  👥 Participants
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {readyCount}/{matchData?.participants?.minCount} min
                </div>
              </div>

              {/* Participants List */}
              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                {participants.map((participant, index) => (
                  <div
                    key={participant.userId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: participant.isReady ? '#d1fae5' : '#f8fafc',
                      border: `2px solid ${participant.isReady ? '#10b981' : '#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: participant.isHost ? '#8b5cf6' : '#6b7280',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '14px',
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {participant.username}
                        {participant.isHost && (
                          <span style={{
                            fontSize: '12px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                          }}>
                            HOST
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {participant.isReady ? '✓ Ready' : '⏳ Not Ready'}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ 
                  length: matchData?.participants?.maxCount - participants.length 
                }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      border: '2px dashed #cbd5e1',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      fontSize: '20px'
                    }}>
                      ?
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                      Waiting for player...
                    </div>
                  </div>
                ))}
              </div>

              {/* Ready Button */}
              {!isHost && (
                <button
                  // onClick={handleReadyToggle}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isReady ? '#ef4444' : '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                >
                  {isReady ? '❌ Cancel Ready' : '✓ I\'m Ready'}
                </button>
              )}

              {/* Start Button (Host only) */}
              {isHost && (
                <button
                  onClick={handleStartMatch}
                  disabled={!canStart}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: canStart ? '#8b5cf6' : '#d1d5db',
                    color: 'white',
                    cursor: canStart ? 'pointer' : 'not-allowed',
                    boxShadow: canStart ? '0 4px 6px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                >
                  {canStart ? '🚀 Start Match' : `⏳ Waiting for ${matchData?.participants?.minCount - readyCount} more`}
                </button>
              )}

              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#92400e',
                textAlign: 'center'
              }}>
                Match starts when {matchData?.participants?.minCount} players are ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingItem({ icon, label, value }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #f1f5f9'
    }}>
      <div style={{ fontSize: '14px', color: '#6b7280' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
        {value}
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react'

export default function MatchResults({ matchId }) {
  const [matchData, setMatchData] = useState(null)
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userRes = await fetch('http://localhost:8000/auth/me', {
          credentials: 'include'
        })
        if (userRes.ok) {
          const userData = await userRes.json()
          setCurrentUserId(userData.profile.user_id)
        }

        // Fetch match data
        const matchRes = await fetch(`http://localhost:8000/match/${matchId}`, {
          credentials: 'include'
        })
        const matchResult = await matchRes.json()
        setMatchData(matchResult.data)

        // Fetch all stories for this match
        const storiesRes = await fetch(`http://localhost:8000/stories/submit/${matchId}`, {
          credentials: 'include'
        })
        const storiesResult = await storiesRes.json()
        setStories(storiesResult.data || [])

        // Auto-select first story
        if (storiesResult.data && storiesResult.data.length > 0) {
          setSelectedStory(storiesResult.data[0])
        }

        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [matchId])

  const handleStorySelect = (story) => {
    setSelectedStory(story)
    setRating(0)
    setFeedback('')
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    if (feedback.trim().length < 10) {
      alert('Please provide feedback (at least 10 characters)')
      return
    }

    setSubmittingReview(true)

    try {
      const response = await fetch(`http://localhost:8000/story/${selectedStory._id}/rate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stars: rating,
          comment: feedback
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      alert('Review submitted successfully!')
      
      // Refresh stories to update ratings
      const storiesRes = await fetch(`http://localhost:8000/stories/match/${matchId}`, {
        credentials: 'include'
      })
      const storiesResult = await storiesRes.json()
      setStories(storiesResult.data || [])
      
      // Update selected story
      const updatedStory = storiesResult.data.find(s => s._id === selectedStory._id)
      if (updatedStory) {
        setSelectedStory(updatedStory)
      }

      setRating(0)
      setFeedback('')
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const hasUserRated = (story) => {
    if (!story.feedback || !currentUserId) return false
    return story.feedback.some(f => f.fromUserId === currentUserId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading match results...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="flex h-screen">
        {/* Left Sidebar - Match Info */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Match Details</h2>

            {/* Host Info */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Hosted By</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {matchData?.hostedBy?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="font-medium text-gray-900">{matchData?.hostedBy?.username}</div>
              </div>
            </div>

            {/* Match Settings */}
            <div className="space-y-4">
              <MatchInfoItem icon="⏱️" label="Time Limit" value={`${matchData?.timeLimit} minutes`} />
              <MatchInfoItem icon="🎭" label="Genres" value={matchData?.genres?.join(', ')} />
              <MatchInfoItem icon="📝" label="Prompt Type" value={matchData?.promptType} />
              {matchData?.wordCap && (
                <MatchInfoItem icon="📊" label="Word Limit" value={`${matchData.wordCap} words`} />
              )}
              <MatchInfoItem icon="👥" label="Participants" value={`${matchData?.ready_users?.length} writers`} />
            </div>

            {/* Prompt */}
            {!matchData?.isBlindPrompt && matchData?.promptText && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xs font-semibold text-purple-600 mb-2">PROMPT</div>
                <div className="text-sm text-gray-800">{matchData.promptText}</div>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Story Display */}
        <div className="flex-1 overflow-y-auto">
          {selectedStory ? (
            <div className="max-w-4xl mx-auto p-8">
              {/* Story Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {selectedStory.content?.title_page || 'Untitled Story'}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedStory.averageStars?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({selectedStory.feedback?.length || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-gray-600">
                  by <span className="font-semibold">{selectedStory.username || 'Anonymous'}</span>
                </div>
              </div>

              {/* Story Content */}
              <div className="prose max-w-none">
                {selectedStory.content?.logline && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Logline</h2>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedStory.content.logline_html }}
                    />
                  </div>
                )}

                {selectedStory.content?.synopsis && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Synopsis</h2>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedStory.content.synopsis_html }}
                    />
                  </div>
                )}

                {selectedStory.content?.characters && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Characters</h2>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedStory.content.characters_html }}
                    />
                  </div>
                )}

                {selectedStory.content?.story && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Story</h2>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedStory.content.story_html }}
                    />
                  </div>
                )}

                {selectedStory.content?.tone_style && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Tone & Style</h2>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedStory.content.tone_style_html }}
                    />
                  </div>
                )}
              </div>

              {/* Rating Section */}
              {selectedStory.user_id !== currentUserId && !hasUserRated(selectedStory) && (
                <div className="mt-12 p-6 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Rate This Story</h3>
                  
                  {/* Star Rating */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Your Rating</div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                          className="text-3xl transition-transform hover:scale-110"
                        >
                          {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {rating > 0 ? `${rating}/10 stars` : 'Click to rate'}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts about this story..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      style={{ color: 'black' }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {feedback.length} characters (minimum 10)
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || rating === 0 || feedback.trim().length < 10}
                    className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {/* Already Rated Message */}
              {hasUserRated(selectedStory) && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-green-800 font-medium">
                    ✓ You have already rated this story
                  </div>
                </div>
              )}

              {/* Own Story Message */}
              {selectedStory.user_id === currentUserId && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <div className="text-blue-800 font-medium">
                    This is your own story
                  </div>
                </div>
              )}

              {/* Existing Reviews */}
              {selectedStory.feedback && selectedStory.feedback.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Reviews ({selectedStory.feedback.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedStory.feedback.map((review, index) => (
                      <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">Anonymous Reviewer</div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{review.stars}/10</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📖</div>
                <div className="text-xl">Select a story to read</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Participants List */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Participants</h2>
            
            <div className="space-y-3">
              {stories.map((story) => (
                <button
                  key={story._id}
                  onClick={() => handleStorySelect(story)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedStory?._id === story._id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {story.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {story.username || 'Anonymous'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium">
                            {story.averageStars?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({story.feedback?.length || 0} reviews)
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {story.content?.total_words || 0} words
                      </div>
                      {hasUserRated(story) && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          ✓ Rated
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {stories.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-2">📝</div>
                <div>No stories submitted yet</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MatchInfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase">{label}</div>
        <div className="text-sm text-gray-900 font-medium">{value}</div>
      </div>
    </div>
  )
}
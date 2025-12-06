'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  PlayIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [activeMatches, setActiveMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.profile.username.charAt(0).toUpperCase());
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchActiveMatches = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches`, {
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error('Failed to fetch matches');
        
        const response = await res.json();
        console.log("Active matches response:", response);
        
        // Response is an array of {success: true, data: {...}} objects
        if (Array.isArray(response)) {
          const mappedMatches = response
            .filter(item => item.success && item.data) // Only process successful responses
            .map(item => {
              const match = item.data;
              console.log("Processing match:", match._id);
              
              return {
                id: match._id || match.id,
                hostName: match.hostedBy?.username || 'Unknown',
                hostInitial: (match.hostedBy?.username || 'U').charAt(0).toUpperCase(),
                participants: match.participants?.userIds?.length || 0,
                maxParticipants: match.maxPlayers || 6,
                minParticipants: match.minPlayers || 3,
                settings: {
                  timeLimit: `${match.timeLimit || 20} minutes`,
                  genres: match.genres || ['General'],
                  promptType: match.promptType || 'Blind Challenge',
                  wordLimit: `${match.wordLimit || 500} words`
                },
                status: match.status || 'waiting'
              };
            });
          
          console.log("Mapped matches:", mappedMatches);
          setActiveMatches(mappedMatches);
        } else {
          setActiveMatches([]);
        }
      } catch (err) {
        console.error("Failed to fetch matches:", err);
        setActiveMatches([]);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchActiveMatches();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleJoinMatch = (matchId) => {
    router.push(`/MatchLobby/${matchId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">PlotTwist</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {username}
                </div>
              </>
            ) : (
              <>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Colaborative writing <span className="text-purple-600">platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Battle other creators in fast-paced storytelling competitions.
            Write scripts, develop characters, and prove your creative skills in real-time.
          </p>

          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("match/start")}
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Start Your First Battle
            </Button>
            <Button variant="outline" size="lg" onClick={handleLogout}>
              LOG OUT
            </Button>
          </div>
        </div>

        {/* Active Match Lobby Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Active Match Lobbies</h2>
            <Button variant="outline" onClick={() => router.push('/match/browse')}>
              View All
            </Button>
          </div>

          {/* Display all active matches */}
          {loadingMatches ? (
            <div className="flex justify-center">
              <div className="animate-pulse bg-gray-200 rounded-xl h-96 w-80"></div>
            </div>
          ) : activeMatches.length === 0 ? (
            <div className="max-w-xs mx-auto text-center py-8">
              <p className="text-gray-500">No active matches available</p>
              <Button 
                className="mt-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => router.push("match/start")}
              >
                Create a Match
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMatches.map((match) => (
                <Card 
                  key={match.id}
                  className="bg-white shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-300"
                  onClick={() => handleJoinMatch(match.id)}
                >
                  <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl">🎬</div>
                        <p className="text-xs uppercase font-bold text-gray-500">Match Lobby</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                        {match.participants}/{match.maxParticipants}
                      </Badge>
                    </div>
                    <small className="text-gray-400 font-mono text-xs">
                      ID: {match.id.slice(0, 12)}...
                    </small>
                    <h4 className="font-bold text-lg text-gray-900 mt-1">
                      {match.settings.genres.join(" • ")}
                    </h4>
                  </CardHeader>
                  
                  <CardContent className="overflow-visible py-4 px-4">
                    {/* Match Settings Visual */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>Duration</span>
                          </span>
                          <span className="text-sm font-bold text-gray-900">{match.settings.timeLimit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center space-x-2">
                            <span>📝</span>
                            <span>Word Limit</span>
                          </span>
                          <span className="text-sm font-bold text-gray-900">{match.settings.wordLimit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center space-x-2">
                            <LockClosedIcon className="h-4 w-4" />
                            <span>Type</span>
                          </span>
                          <span className="text-sm font-bold text-gray-900">{match.settings.promptType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Players Preview */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Players</span>
                        <span className="text-xs text-gray-500">{match.maxParticipants - match.participants} slots open</span>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white">
                          {match.hostInitial}
                        </div>
                        {[...Array(match.maxParticipants - 1)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-10 h-10 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm"
                          >
                            ?
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      <p className="text-xs font-semibold text-yellow-800">Waiting for players</p>
                      <p className="text-xs text-yellow-600 mt-1">Click to join</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How PlotTwist Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Join a Battle</h3>
              <p className="text-gray-600">
                Get matched with writers of similar skill level or join specific genre battles
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Write Under Pressure</h3>
              <p className="text-gray-600">
                Create compelling stories, dialogue, or scripts within time limits using given prompts
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Judged & Improve</h3>
              <p className="text-gray-600">
                Receive feedback from peers and experts, climb the leaderboards, unlock achievements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-2">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 PlotTwist.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
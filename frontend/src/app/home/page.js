'use client'
// import { useState } from 'react';
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import MatchSettings from '../components/MatchStart';
import { useRouter } from 'next/navigation';
import {
  PlayIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        const data = await res.json();
        console.log("res", data.profile.username);
        if (res.ok) {
          console.log("OPOPOP");
          setUsername(data.profile.username);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("popop");

        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  // Mock data for featured battles
  const featuredBattles = [
    {
      id: 1,
      genre: "Horror",
      prompt: "Write opening scene for a psychological thriller",
      participants: 3,
      timeLeft: "12 min",
      maxParticipants: 4,
      status: "waiting"
    },
    {
      id: 2,
      genre: "Comedy",
      prompt: "Create dialogue between two characters stuck in elevator",
      participants: 2,
      timeLeft: "8 min",
      maxParticipants: 3,
      status: "active"
    },
    {
      id: 3,
      genre: "Sci-Fi",
      prompt: "Character discovers they're living in simulation",
      participants: 4,
      timeLeft: "Starting soon",
      maxParticipants: 4,
      status: "full"
    }
  ];

  // Mock leaderboard data
  const topWriters = [
    { rank: 1, name: "StoryMaster", rating: 1847, badge: "🏆" },
    { rank: 2, name: "PlotGenius", rating: 1632, badge: "🥈" },
    { rank: 3, name: "ScriptWiz", rating: 1598, badge: "🥉" },
    { rank: 4, name: "CreativeKing", rating: 1456, badge: "" },
    { rank: 5, name: "WordSmith", rating: 1389, badge: "" }
  ];

  const dailyPrompt = {
    genre: "Mystery",
    prompt: "A librarian discovers a book that writes itself",
    constraint: "Must include: vintage key, secret message, midnight deadline"
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-orange-100 text-orange-800';
      case 'full': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'Open';
      case 'active': return 'Live';
      case 'full': return 'Full';
      default: return 'Unknown';
    }
  };
  // function StartBattle() {
  // const [BattleStart,setBattleStart] = useState(false);
  // }
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
                <Button variant="outline" size="sm">
                  <TrophyIcon className="h-4 w-4 mr-2" />
                  Leaderboard
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Quick Battle
                </Button>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {username}
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  <a href="/login">Sign In</a>
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <a href="/register">Join PlotTwist</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Chess.com for <span className="text-purple-600">Filmmakers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Battle other creators in fast-paced storytelling competitions.
            Write scripts, develop characters, and prove your creative skills in real-time.
          </p>

          {
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700"
                // onClick={()=>setBattleStart(true)}
                onClick={() => router.push("match/start")}
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Your First Battle
              </Button>
              {/* {BattleStart && <MatchSettings/>} */}
              <Button variant="outline" size="lg">
                <LightBulbIcon className="h-5 w-5 mr-2" />
                How It Works
              </Button>
              <Button variant="outline" size="lg" onClick={handleLogout}>
                <LightBulbIcon className="h-5 w-5 mr-2" />
                LOG OUT
              </Button>
            </div>
          }
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Battles */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Live Battles</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {featuredBattles.map((battle) => (
                <Card key={battle.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {battle.genre}
                        </Badge>
                        <Badge className={getStatusColor(battle.status)}>
                          {getStatusText(battle.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {battle.timeLeft}
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {battle.prompt}
                    </h3>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {battle.participants}/{battle.maxParticipants} writers
                      </div>

                      <Button
                        size="sm"
                        disabled={battle.status === 'full'}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                      >
                        {battle.status === 'full' ? 'Battle Full' :
                          battle.status === 'active' ? 'Spectate' : 'Join Battle'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {isLoggedIn && (
              <Card className="mt-6 border-dashed border-2 border-purple-200 hover:border-purple-400 transition-colors">
                <CardContent className="p-8 text-center">
                  <BoltIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready for a Quick Battle?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get matched instantly with writers of similar skill level
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Find Battle Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Daily Creative Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="mb-3 bg-yellow-100 text-yellow-800">
                  {dailyPrompt.genre}
                </Badge>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {dailyPrompt.prompt}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {dailyPrompt.constraint}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Take Challenge
                </Button>
              </CardContent>
            </Card>

            {/* Top Writers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2 text-gold-500" />
                  Top Writers This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topWriters.map((writer) => (
                    <div key={writer.rank} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 text-sm font-semibold text-gray-500">
                          {writer.badge || `#${writer.rank}`}
                        </span>
                        <span className="font-medium text-gray-900">
                          {writer.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">
                        {writer.rating}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {isLoggedIn && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-semibold text-purple-600">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Battles Won</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Win Streak</span>
                      <span className="font-semibold flex items-center">
                        <FireIcon className="h-4 w-4 text-orange-500 mr-1" />
                        3
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Favorite Genre</span>
                      <Badge variant="secondary">Horror</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 PlotTwist. Chess.com for Filmmakers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
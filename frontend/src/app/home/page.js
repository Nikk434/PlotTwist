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
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me", {
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include"
  //       });
  //       const data = await res.json();
  //       console.log("res", data.profile.username);
  //       if (res.ok) {
  //         console.log("OPOPOP");
  //         setUsername(data.profile.username);
  //         setIsLoggedIn(true);
  //       }
  //     } catch (err) {
  //       console.log("popop");

  //       setIsLoggedIn(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {  // Changed from full URL to relative path
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          console.log("User:", data.profile.username);
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
              <Button variant="outline" size="lg" onClick={handleLogout}>
                {/* <LightBulbIcon className="h-5 w-5 mr-2" /> */}
                LOG OUT
              </Button>
            </div>
          }
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
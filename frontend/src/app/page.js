import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlayIcon } from "@heroicons/react/24/solid"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="battle-card text-white text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          PlotTwist
        </h1>
        <p className="text-lg mb-6 text-gray-300">
          Chess.com for Filmmakers
        </p>
        <Button className="w-full glow-effect" size="lg">
          <PlayIcon className="w-5 h-5 mr-2" />
          Start Your First Battle
        </Button>
      </Card>
    </main>
  )
}
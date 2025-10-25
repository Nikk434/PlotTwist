'use client'
// import MatchLobby from './components/MatchLobby'
import { use } from 'react'
import MatchResult from "@/app/components/MatchResult";
export default function MatchResultsPage({ params }) {
    const { matchId } = use(params)
    console.log("MATCHA 3 = = = = ", matchId);

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
    return <MatchResult matchId={params.matchId} />
}
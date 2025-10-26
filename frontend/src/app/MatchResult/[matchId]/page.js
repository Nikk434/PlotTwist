'use client'
import React from "react"
import MatchResult from "@/app/components/MatchResult"

export default function MatchResultsPage({ params }) {
    const { matchId } = React.use(params) // unwrap the promise

    console.log("MATCHA 3 = = = = ", matchId)

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

    return <MatchResult matchId={matchId} />
}

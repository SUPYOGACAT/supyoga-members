'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NextDayButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleNextDay = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action_type: 'START_NEXT_DAY',
                    payload: {}
                })
            })

            if (!res.ok) throw new Error('Failed to start next day')

            // Force reload to update server layout
            window.location.reload();
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleNextDay}
            disabled={isLoading}
            className="group relative px-10 py-4 bg-blue-600/20 hover:bg-blue-600/30 text-[#E6F0FF] border border-blue-400/30 rounded-full transition-all duration-500 font-light tracking-[0.3em] uppercase text-xs shadow-lg shadow-blue-900/10 hover:shadow-blue-500/10 disabled:opacity-20 flex items-center gap-3 active:scale-95"
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-[#E6F0FF]/30 border-t-[#E6F0FF] rounded-full animate-spin"></span>
            ) : (
                <>
                    Preparar el Mañana
                    <span className="text-lg translate-y-[1px] group-hover:translate-x-1 transition-transform">→</span>
                </>
            )}
        </button>
    )
}

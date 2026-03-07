'use client'

import { useEffect, useState } from 'react'

interface WaterDropsCounterProps {
    total: number;
    justEarned?: number;
}

export default function WaterDropsCounter({ total, justEarned = 0 }: WaterDropsCounterProps) {
    const [showBonus, setShowBonus] = useState(false);

    useEffect(() => {
        if (justEarned > 0) {
            setShowBonus(true);
            const t = setTimeout(() => setShowBonus(false), 3000);
            return () => clearTimeout(t);
        }
    }, [justEarned]);

    return (
        <div className="flex items-center gap-2 relative">
            <span className="text-blue-300/50 text-sm select-none" title="Gotas de agua">💧</span>
            <span className="text-blue-100/60 text-sm font-light tracking-widest">{total}</span>

            {showBonus && (
                <span
                    className="absolute -top-5 left-0 text-blue-300 text-xs font-light animate-bounce-up pointer-events-none"
                    style={{
                        animation: 'floatUp 2.5s ease-out forwards',
                    }}
                >
                    +{justEarned}
                </span>
            )}

            <style jsx>{`
                @keyframes floatUp {
                    0% { opacity: 0; transform: translateY(0px); }
                    20% { opacity: 1; transform: translateY(-4px); }
                    80% { opacity: 1; transform: translateY(-12px); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}

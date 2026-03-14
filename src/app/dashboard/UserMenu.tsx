'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function UserMenu({ userName }: { userName?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const displayText = userName || "Miembro"

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-200/60 transition-colors hover:text-blue-200">
                    {displayText}
                </span>
                <span className={`text-[8px] text-blue-400/80 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-[#0b1a29]/90 backdrop-blur-xl border border-[#1a365d]/50 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in z-50">
                    <div className="py-2">
                        {/* Future link to profile can go here */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full text-left px-6 py-3 text-sm font-normal text-slate-300 hover:bg-blue-900/20 hover:text-white transition-colors flex items-center gap-3 disabled:opacity-50"
                        >
                            {isLoggingOut ? (
                                <span className="w-3 h-3 border border-slate-300 border-t-transparent rounded-full animate-spin"></span>
                            ) : null}
                            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

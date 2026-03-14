'use client'

import { useState } from 'react'
import CompanionResponseCard from './CompanionResponseCard'
import { useRouter } from 'next/navigation'

export default function ReflectionForm({ day }: { day: number }) {
    const [reflection, setReflection] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [companionResponse, setCompanionResponse] = useState<string | null>(null)
    const [patternInsight, setPatternInsight] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action_type: 'REFLECTION_SUBMITTED',
                    payload: { text: reflection }
                })
            })

            if (!res.ok) throw new Error('Failed to submit reflection')

            const data = await res.json()

            if (data.process_result?.companionResponse) {
                setCompanionResponse(data.process_result.companionResponse)
            } else {
                setCompanionResponse("Entendido. Nos vemos mañana.")
            }

            if (data.process_result?.patternInsight) {
                setPatternInsight(data.process_result.patternInsight)
            }

        } catch (err) {
            setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (companionResponse) {
        return (
            <div className="w-full animate-fade-in flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-blue-400/30 text-[10px] uppercase tracking-[0.4em]">Respuesta del Compañero</span>
                </div>
                <CompanionResponseCard response={companionResponse} />

                {patternInsight && (
                    <div className="mt-12 max-w-xl mx-auto text-center px-6 py-8 border-t border-blue-500/10 animate-fade-in animate-delay-300">
                        <span className="text-blue-400/20 text-[8px] uppercase tracking-[0.4em] block mb-4">Nota del Viaje</span>
                        <p className="text-slate-300 font-normal text-base md:text-lg leading-relaxed italic opacity-90 drop-shadow-sm">
                            {patternInsight}
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="mt-12 px-8 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-200 border border-blue-500/30 rounded-xl transition-all font-normal tracking-widest uppercase text-xs backdrop-blur-sm shadow-lg shadow-blue-900/20"
                >
                    Cerrar Práctica de Hoy
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mt-16 animate-fade-in relative space-y-10">
            <div className="relative">
                <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="¿Qué has notado en tu cuerpo? ¿Qué ha cambiado en ti durante estos minutos?"
                    className="w-full min-h-[180px] bg-[#0d2136]/50 border border-[#1e3a5f]/60 rounded-3xl p-8 text-slate-200 placeholder-[#9FB3CC]/40 focus:outline-none focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20 transition-all resize-none shadow-inner text-lg font-normal leading-[1.6] backdrop-blur-md"
                    disabled={isSubmitting}
                />

                {/* Subtle decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none mix-blend-screen"></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4 px-2">
                <p className="text-slate-300/70 text-sm font-normal italic leading-relaxed text-center sm:text-left">No hay una respuesta correcta. Simplemente escribe lo que esté presente.</p>
                {error && <p className="text-rose-300/80 text-sm font-medium">{error}</p>}
            </div>

            <div className="pt-4 flex justify-center">
                <button
                    type="submit"
                    disabled={isSubmitting || reflection.trim().length === 0}
                    className="px-12 py-4 bg-blue-600/10 hover:bg-blue-600/20 text-[#E6F0FF] border border-blue-500/30 rounded-full transition-all duration-500 font-normal tracking-widest uppercase text-xs shadow-lg shadow-blue-900/10 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm w-full sm:w-auto hover:shadow-blue-500/5 hover:-translate-y-0.5"
                >
                    {isSubmitting ? 'Descansando...' : 'Marcar el Momento de Hoy'}
                </button>
            </div>
        </form>
    )
}

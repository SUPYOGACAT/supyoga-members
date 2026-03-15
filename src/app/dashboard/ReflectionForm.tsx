'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { blueResetJourney, dayZeroModule } from '@/data/journey'

interface StarRatingProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
}

function StarRating({ label, value, onChange }: StarRatingProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-slate-300 text-sm tracking-widest uppercase">{label}</span>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`text-2xl transition-all hover:scale-110 ${star <= value ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'text-slate-600/50 hover:text-blue-400/50'}`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function ReflectionForm({ day, practice }: { day: number, practice?: string }) {
    const [energyScore, setEnergyScore] = useState(0)
    const [calmScore, setCalmScore] = useState(0)
    const [stressScore, setStressScore] = useState(0)
    const [reflection, setReflection] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const currentModule = day === 0 ? dayZeroModule : blueResetJourney.find(d => d.day === day);
    // Use fallback message depending on the context if no module found
    const rewardMessage = currentModule && 'rewardMessage' in currentModule ? currentModule.rewardMessage : 'Has dado un paso más en tu camino de bienestar hoy. Sigue así.';

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
                    payload: { 
                        text: reflection,
                        energy_score: energyScore,
                        calm_score: calmScore,
                        stress_score: stressScore
                    }
                })
            })

            if (!res.ok) throw new Error('Failed to submit reflection')

            const data = await res.json()
            setIsFinished(true)

        } catch (err) {
            setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isFinished) {
        return (
            <div className="w-full animate-fade-in flex flex-col items-center">
                <div className="bg-[#19325a]/60 rounded-3xl p-10 md:p-12 border border-blue-400/30 mb-12 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group max-w-2xl text-center">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                    
                    <p className="text-[#E6F0FF] text-xl md:text-2xl leading-relaxed font-light whitespace-pre-line relative z-10 italic">
                        {rewardMessage as string}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="mt-6 px-10 py-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-200 border border-blue-500/30 rounded-full transition-all font-normal tracking-widest uppercase text-xs backdrop-blur-sm shadow-lg shadow-blue-900/20"
                >
                    {day === 0 ? 'Cerrar Día 0' : 'Cerrar Práctica de Hoy'}
                </button>
            </div>
        )
    }

    const isFormValid = energyScore > 0 && calmScore > 0 && stressScore > 0;

    return (
        <form onSubmit={handleSubmit} className="mt-16 animate-fade-in space-y-16 max-w-2xl mx-auto">
            
            <div className="space-y-8">
                <h3 className="text-2xl text-[#E6F0FF] font-light text-center mb-10">¿Cómo te sientes ahora?</h3>
                
                <div className="flex flex-col gap-10 bg-[#0d2136]/50 p-10 rounded-[30px] border border-[#1e3a5f]/40 shadow-inner backdrop-blur-sm">
                    <StarRating label="Energía" value={energyScore} onChange={setEnergyScore} />
                    <StarRating label="Estrés" value={stressScore} onChange={setStressScore} />
                    <StarRating label="Calma Mental" value={calmScore} onChange={setCalmScore} />
                </div>
            </div>

            <div className="space-y-6 text-center">
                <h3 className="text-xl text-[#E6F0FF] font-light opacity-90">
                    {day === 0 ? "¿Qué has descubierto en este test?" : "¿Qué has notado durante la práctica?"}
                </h3>
                <div className="relative">
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder={day === 0 ? "Escribe aquí los resultados que has escrito en tu papel" : "Escribe una palabra, sensación o pensamiento... (Opcional)"}
                        className="w-full min-h-[120px] bg-[#0d2136]/30 border border-[#1e3a5f]/40 rounded-2xl p-6 text-slate-200 placeholder-[#9FB3CC]/30 focus:outline-none focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20 transition-all resize-none shadow-inner text-base font-normal leading-relaxed backdrop-blur-md"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-6 px-2">
                {practice && (
                    <p className="text-slate-300 font-normal italic text-base md:text-lg leading-relaxed text-center max-w-xl mx-auto opacity-80 mt-4">
                        {practice}
                    </p>
                )}
                {error && <p className="text-rose-300/80 text-sm font-medium">{error}</p>}
            </div>

            <div className="pt-4 flex flex-col items-center gap-8">
                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="px-12 py-4 bg-blue-600/20 hover:bg-blue-600/30 text-[#E6F0FF] border border-blue-500/30 rounded-full transition-all duration-500 font-normal tracking-widest uppercase text-xs shadow-[0_15px_40px_-10px_rgba(59,130,246,0.3)] disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none backdrop-blur-sm w-full sm:w-auto hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)] hover:-translate-y-1"
                >
                    {isSubmitting ? 'Guardando...' : (day === 0 ? 'Guardar Test Inicial' : 'Completar Día')}
                </button>

                <p className="text-slate-500 text-[10px] md:text-xs font-light text-center max-w-sm leading-relaxed opacity-60">
                    Toda esta información es para tu propio proceso, no se hará pública ningún valor ni nada de lo que compartas aquí, es personal y es tuyo.
                </p>
            </div>
        </form>
    )
}

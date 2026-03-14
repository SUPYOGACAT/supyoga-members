'use client'

import React from 'react';
import Link from 'next/link';

export interface FinalProfile {
    mode: 'calm' | 'energy' | 'connection';
    title: string;
    description: string;
    scores: {
        calm: number;
        energy: number;
        stress: number;
    };
    completionPercentage: number;
}

export default function DaySevenResult({ summary }: { summary: FinalProfile | string }) {
    // Fallback if the component receives the old string format before cache clears
    const isProfile = typeof summary === 'object' && summary !== null && 'title' in summary;
    
    if (!isProfile) {
        return (
            <div className="w-full animate-fade-in text-center py-20">
                <p className="text-slate-300 italic">{String(summary)}</p>
            </div>
        );
    }

    const { title, description, scores, completionPercentage } = summary as FinalProfile;

    // Calculate max score for relative bar sizing
    const maxScore = Math.max(scores.calm, scores.energy, scores.stress) || 1;
    const getWidth = (score: number) => `${Math.max((score / maxScore) * 100, 5)}%`;

    return (
        <div className="w-full animate-fade-in relative z-10 py-8">



            {/* 2. Radar/Bars */}
            <div className="max-w-xl mx-auto mb-16 space-y-6 px-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
                        <span>Calma Mental</span>
                        <span className="font-mono">{scores.calm}</span>
                    </div>
                    <div className="h-3 w-full bg-[#0a192f] rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full transition-all duration-1000" style={{ width: getWidth(scores.calm) }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
                        <span>Vitalidad y Movimiento</span>
                        <span className="font-mono">{scores.energy}</span>
                    </div>
                    <div className="h-3 w-full bg-[#0a192f] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: getWidth(scores.energy) }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
                        <span>Nivel de Estrés</span>
                        <span className="font-mono">{scores.stress}</span>
                    </div>
                    <div className="h-3 w-full bg-[#0a192f] rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full transition-all duration-1000" style={{ width: getWidth(scores.stress) }}></div>
                    </div>
                </div>
            </div>

            {/* 3. The Profile Card */}
            <div className="bg-[#19325a]/60 rounded-[40px] p-10 md:p-14 border border-blue-400/20 mb-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group max-w-3xl mx-auto">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="text-4xl">🌊</div>
                    <h3 className="text-[#E6F0FF] text-3xl font-medium tracking-wide">
                        Perfil: {title}
                    </h3>
                    <p className="text-slate-200 text-lg leading-[1.8] font-light max-w-2xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* 4. Reflection Message */}
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                <p className="text-slate-300 font-normal leading-relaxed text-lg">
                    Durante estos 7 días has dedicado tiempo a escucharte, respirar y moverte con conciencia. Pequeños gestos como estos tienen un efecto acumulativo en tu bienestar.
                </p>
                <p className="text-[#E6F0FF] text-xl font-medium italic">
                    La pregunta ahora es:<br/>¿Qué pasaría si siguieras practicando?
                </p>
            </div>



        </div>
    )
}

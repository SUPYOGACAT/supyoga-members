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
        connection: number;
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
    const maxScore = Math.max(scores.calm, scores.energy, scores.connection) || 1;
    const getWidth = (score: number) => `${Math.max((score / maxScore) * 100, 5)}%`;

    return (
        <div className="w-full animate-fade-in relative z-10 py-8">

            {/* 1. Journey Completion Header */}
            <div className="text-center mb-16 space-y-6">
                <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">Has completado el {completionPercentage}% del reto</span>
                <h2 className="text-5xl md:text-6xl font-normal text-[#E6F0FF] tracking-tighter opacity-95 drop-shadow-sm">
                    Tu viaje en el Reset Azul
                </h2>
                <div className="flex gap-1 justify-center mt-4">
                     {[...Array(7)].map((_, i) => (
                        <div key={i} className={`h-1.5 w-12 rounded-full ${i < Math.round((completionPercentage/100)*7) ? 'bg-blue-400' : 'bg-[#19325a]'}`}></div>
                    ))}
                </div>
            </div>

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
                        <span>Conexión Interna</span>
                        <span className="font-mono">{scores.connection}</span>
                    </div>
                    <div className="h-3 w-full bg-[#0a192f] rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full transition-all duration-1000" style={{ width: getWidth(scores.connection) }}></div>
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

            {/* 5. Call To Action */}
            <div className="text-center border-t border-[#1a365d]/50 pt-16">
                <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
                    Si este perfil resuena contigo, en Club Calma Azul puedes seguir profundizando en tu camino de bienestar.
                </p>
                <Link href="/membership" className="inline-block px-12 py-5 bg-blue-600/20 hover:bg-blue-600/30 text-[#E6F0FF] border border-blue-400/30 rounded-full transition-all duration-700 font-normal shadow-[0_15px_40px_-10px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] hover:-translate-y-1 backdrop-blur-md w-full sm:w-auto uppercase tracking-[0.2em] text-sm">
                    Explorar Club Calma Azul
                </Link>
            </div>

        </div>
    )
}

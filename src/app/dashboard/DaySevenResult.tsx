'use client'

import React from 'react';
import Link from 'next/link';

export default function DaySevenResult({ summary }: { summary: string }) {
    const JOURNEY_STAGES = [
        'Superficie', 'Flotando', 'Inmersión', 'Fluidez', 'Liberación', 'Integración', 'Vida en Azul'
    ];

    return (
        <div className="w-full animate-fade-in relative z-10 py-8">

            {/* 1. Journey Completion Header */}
            <div className="text-center mb-20 space-y-6">
                <h2 className="text-5xl md:text-7xl font-extralight text-[#E6F0FF] tracking-tighter opacity-95 drop-shadow-sm">
                    El reseteo ha concluido
                </h2>
                <p className="text-[#C8D6EA] text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
                    Siete días de pequeños momentos pueden cambiar la forma en que regresamos a nosotros mismos.
                </p>
            </div>

            {/* 2. Reflective Summary */}
            <div className="mb-16 text-center max-w-3xl mx-auto px-6">
                <p className="text-[#C8D6EA] leading-[1.7] text-xl md:text-2xl font-light italic opacity-90">
                    {summary}
                </p>
            </div>

            {/* 3. Blue Insight */}
            <div className="bg-[#19325a]/60 rounded-[40px] p-12 md:p-16 border border-blue-400/20 mb-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl text-center relative overflow-hidden group">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                <p className="text-[#E6F0FF] italic font-light text-2xl md:text-3xl leading-[1.6] opacity-95 relative z-10">
                    "La calma no es algo que creemos. <br className="hidden md:block" />
                    Es algo que recordamos cuando el ruido se asienta."
                </p>
            </div>

            {/* 5 & 6 & 7. Invitation to Continue & Actions */}
            <div className="text-center space-y-12 max-w-2xl mx-auto border-t border-[#1a365d]/50 pt-20">
                <div className="space-y-6">
                    <h3 className="text-3xl font-light text-[#E6F0FF] tracking-wide">Vivir en Azul</h3>
                    <p className="text-[#C8D6EA] font-light text-lg md:text-xl leading-relaxed">
                        Blue Reset es solo el comienzo.<br />
                        La verdadera transformación ocurre cuando estos pequeños rituales se vuelven parte de la vida diaria.
                    </p>
                    <p className="text-[#9FB3CC] text-sm md:text-base font-light px-8">
                        Únete a Blue Wellness para prácticas guiadas, sesiones de SUP Yoga y una comunidad que valora la presencia.
                    </p>
                </div>

                <div className="flex flex-col gap-6 mt-12 items-center">
                    <Link href="/membership" className="inline-block px-12 py-5 bg-blue-600/20 hover:bg-blue-600/30 text-[#E6F0FF] border border-blue-400/30 rounded-full transition-all duration-700 font-light tracking-widest shadow-[0_15px_40px_-10px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] hover:-translate-y-1 backdrop-blur-md w-full sm:w-auto text-xl text-center uppercase tracking-[0.2em] text-xs">
                        Explorar Blue Wellness
                    </Link>
                    <Link href="/dashboard?day=1" className="text-xs uppercase tracking-[0.4em] text-[#9FB3CC] hover:text-[#E6F0FF] transition-colors py-4">
                        Revisar el viaje (Día 1)
                    </Link>
                </div>
            </div>

        </div>
    )
}

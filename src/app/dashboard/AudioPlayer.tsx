'use client'

import React from 'react';

export default function AudioPlayer({ url, label }: { url: string; label?: string }) {
    return (
        <div className="w-full max-w-3xl mx-auto mb-6 last:mb-20 bg-[#050c14]/40 rounded-[2rem] border border-[#1a365d]/20 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-blue-500/5 shimmer-effect pointer-events-none opacity-30"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Icon section */}
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-500 shadow-lg shadow-blue-900/10">
                    <span className="text-xl opacity-80">🎧</span>
                </div>

                <div className="flex-1 text-center md:text-left space-y-1">
                    <h4 className="text-blue-100 text-base md:text-lg font-normal tracking-wide">{label || 'Escuchar Práctica'}</h4>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-light">Audio de la sesión</p>
                </div>

                {/* Actual audio control */}
                <div className="w-full md:w-auto min-w-[280px]">
                    <audio 
                        src={url} 
                        controls 
                        className="w-full h-10 opacity-80 hover:opacity-100 transition-opacity filter invert-[0.8] brightness-125"
                        controlsList="nodownload"
                    >
                        Tu navegador no soporta el audio.
                    </audio>
                </div>
            </div>

            {/* Subtle bottom border highlight */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        </div>
    );
}

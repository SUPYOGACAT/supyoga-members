'use client'

interface CompanionIntroProps {
    userName?: string;
    dayTheme: string;
    day: number;
}

export default function CompanionIntro({ userName, dayTheme, day }: CompanionIntroProps) {
    const intros: Record<number, string> = {
        1: "Hoy no hay nada que conseguir. Solo notar lo que ya está aquí.",
        2: "La respiración no necesita ser guiada. Simplemente observa su ritmo natural.",
        3: "El cuerpo sabe cosas que la mente aún no ha articulado.",
        4: "El movimiento no es un objetivo. Es una forma de escuchar.",
        5: "Lo que sueltas no desaparece. Se convierte en espacio.",
        6: "Los rituales pequeños son los que aguantan. No los grandes gestos.",
        7: "Has llegado hasta aquí. Eso ya es todo lo que necesitabas hacer.",
    };

    const message = intros[day] || "Estás aquí. Eso es suficiente.";

    return (
        <div className="max-w-2xl mx-auto mb-16 text-center animate-fade-in bg-[#19325a]/85 border border-blue-400/25 p-10 md:p-14 rounded-[32px] backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden group">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400/5 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>

            <div className="flex items-center justify-center gap-3 mb-6 relative z-10">
                <span className="text-blue-400/40 text-[10px] tracking-widest">〰</span>
                <span className="text-slate-300 text-[10px] uppercase tracking-[0.4em] font-medium">Compañero</span>
                <span className="text-blue-400/40 text-[10px] tracking-widest">〰</span>
            </div>
            <p className="text-[#E6F0FF] font-normal italic text-xl md:text-2xl leading-[1.6] relative z-10 tracking-wide drop-shadow-sm px-4">
                "{message}"
            </p>
        </div>
    );
}

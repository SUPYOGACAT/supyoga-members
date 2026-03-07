interface MicroInsightProps {
    sentiment: 'calm' | 'neutral' | 'low_emotion' | null;
    day: number;
}

export default function MicroInsight({ sentiment, day }: MicroInsightProps) {
    const insightsBySentiment: Record<string, string[]> = {
        calm: [
            "Pareces encontrar la quietud con facilidad.",
            "Tu sistema nervioso reconoce el ritmo.",
            "Notas el espacio entre pensamientos.",
        ],
        neutral: [
            "Cada observación, aunque breve, es información.",
            "La atención constante construye presencia.",
            "Estar aquí ya es hacer algo.",
        ],
        low_emotion: [
            "Lo que pesa tiene su propio peso. No necesitas aligerarlo.",
            "Algunos días el agua está agitada. Eso también es el mar.",
            "Aparecer cuando es difícil es la práctica más profunda.",
        ],
    };

    const key = sentiment || 'neutral';
    const pool = insightsBySentiment[key] || insightsBySentiment['neutral'];
    const insight = pool[(day - 1) % pool.length];

    return (
        <div className="mt-8 max-w-sm mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-blue-400/30 text-xs">〰</span>
                <span className="text-blue-400/40 text-[9px] uppercase tracking-[0.3em]">Observación del Sistema</span>
                <span className="text-blue-400/30 text-xs">〰</span>
            </div>
            <p className="text-slate-400/80 text-sm font-light italic leading-relaxed">"{insight}"</p>
        </div>
    );
}

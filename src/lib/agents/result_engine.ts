import { createClient } from '@/utils/supabase/server';

export interface FinalProfile {
    mode: 'calm' | 'energy' | 'stress';
    title: string;
    description: string;
    scores: {
        calm: number;
        energy: number;
        stress: number;
    };
    completionPercentage: number;
}

export const ResultEngine = {
    async generateSummary(userId: string): Promise<FinalProfile> {
        const supabase = await createClient();

        // NOTE: DB column is `connection_score` (migration 00004 was not applied)
        // The `connection_score` stores the Estrés value from the form
        const { data: reflections, error } = await supabase
            .from('reflections')
            .select('day, energy_score, calm_score, connection_score')
            .eq('user_id', userId)
            .gte('day', 1)
            .lte('day', 7);

        console.log('[ResultEngine] reflections fetched:', JSON.stringify(reflections));
        console.log('[ResultEngine] fetch error:', error);

        // Fallback or empty state
        const defaultProfile: FinalProfile = {
            mode: 'calm',
            title: 'Buscadora de calma',
            description: 'Tu cuerpo responde muy bien cuando bajas el ritmo. Las prácticas de respiración, meditación y presencia tienen un impacto directo en cómo te sientes. Tu camino pasa por darte más espacios de pausa y regulación en tu día a día.',
            scores: { calm: 0, energy: 0, stress: 0 },
            completionPercentage: 0
        };

        if (!reflections || reflections.length === 0) {
            console.log('[ResultEngine] No reflections found, returning default profile');
            return defaultProfile;
        }

        let totalCalm = 0;
        let totalEnergy = 0;
        let totalStressPositivo = 0;
        let daysCompleted = 0;

        reflections.forEach((r: { calm_score: number | null, energy_score: number | null, connection_score: number | null }) => {
            // Use null check (not falsy) so that a score of 0 doesn't skip the record
            if (r.calm_score !== null || r.energy_score !== null || r.connection_score !== null) {
                daysCompleted++;
                totalCalm += r.calm_score ?? 0;
                totalEnergy += r.energy_score ?? 0;
                // Invert stress score: lower stress (1) → higher positivo (5), higher stress (5) → lower positivo (1)
                totalStressPositivo += r.connection_score !== null ? (6 - r.connection_score) : 0;
            }
        });

        console.log('[ResultEngine] totals:', { totalCalm, totalEnergy, totalStressPositivo, daysCompleted });

        const scores = [
            { mode: 'calm' as const, score: totalCalm, priority: 3 },
            { mode: 'stress' as const, score: totalStressPositivo, priority: 2 },
            { mode: 'energy' as const, score: totalEnergy, priority: 1 }
        ];

        // Sort by score descending, then by priority descending for tie-breaking
        scores.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.priority - a.priority;
        });

        const winner = scores[0].mode;
        console.log('[ResultEngine] winner:', winner);

        let title = '';
        let description = '';

        if (winner === 'calm') {
            title = 'Buscadora de calma';
            description = 'Tu cuerpo responde muy bien cuando bajas el ritmo. Las prácticas de respiración, meditación y presencia tienen un impacto directo en cómo te sientes. Tu camino pasa por darte más espacios de pausa y regulación en tu día a día.';
        } else if (winner === 'energy') {
            title = 'Exploradora del cuerpo';
            description = 'Tu bienestar mejora especialmente cuando incluyes movimiento consciente. Caminar, respirar y movilizar el cuerpo te ayuda a liberar tensión y recuperar tu energía. Tu camino pasa por seguir habitando el cuerpo con más presencia.';
        } else {
            // winner === 'stress'
            title = 'Navegante de la calma';
            description = 'Tu sistema nervioso responde especialmente bien cuando liberas tensión y permites que el cuerpo vuelva a un estado de seguridad. Reducir el estrés y encontrar momentos de calma tiene un impacto profundo en tu bienestar. Tu camino pasa por mantener pequeños rituales que te ayuden a regular tu día a día.';
        }

        return {
            mode: winner,
            title,
            description,
            scores: {
                calm: totalCalm,
                energy: totalEnergy,
                stress: totalStressPositivo
            },
            completionPercentage: Math.round((daysCompleted / 7) * 100)
        };
    }
};

import { createClient } from '@/utils/supabase/server';

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

export const ResultEngine = {
    async generateSummary(userId: string): Promise<FinalProfile> {
        const supabase = await createClient();

        const { data: reflections } = await supabase
            .from('reflections')
            .select('day, energy_score, calm_score, stress_score')
            .eq('user_id', userId)
            .gte('day', 1)
            .lte('day', 7);

        // Fallback or empty state
        const defaultProfile: FinalProfile = {
            mode: 'calm',
            title: 'Buscadora de calma',
            description: 'Tu cuerpo responde muy bien cuando bajas el ritmo. Las prácticas de respiración, meditación y presencia tienen un impacto directo en cómo te sientes. Tu camino pasa por darte más espacios de pausa y regulación en tu día a día.',
            scores: { calm: 0, energy: 0, stress: 0 },
            completionPercentage: 0
        };

        if (!reflections || reflections.length === 0) {
            return defaultProfile;
        }

        let totalCalm = 0;
        let totalEnergy = 0;
        let totalStress = 0;
        let daysCompleted = 0;

        reflections.forEach((r: { calm_score: number | null, energy_score: number | null, stress_score: number | null }) => {
            if (r.calm_score || r.energy_score || r.stress_score) {
                daysCompleted++;
                totalCalm += r.calm_score || 0;
                totalEnergy += r.energy_score || 0;
                totalStress += r.stress_score || 0;
            }
        });

        const sortedScores = [
            { mode: 'calm' as const, score: totalCalm },
            { mode: 'energy' as const, score: totalEnergy }
        ].sort((a, b) => b.score - a.score); // Descending

        // If it's a tie, they are "Connected with the Blue"
        let winner: 'calm' | 'energy' | 'connection' = sortedScores[0].mode;
        if (totalCalm === totalEnergy) {
            winner = 'connection';
        }

        let title = '';
        let description = '';

        if (winner === 'calm') {
            title = 'Buscadora de calma';
            description = 'Tu cuerpo responde muy bien cuando bajas el ritmo. Las prácticas de respiración, meditación y presencia tienen un impacto directo en cómo te sientes. Tu camino pasa por darte más espacios de pausa y regulación en tu día a día.';
        } else if (winner === 'energy') {
            title = 'Exploradora del cuerpo';
            description = 'Tu bienestar mejora especialmente cuando incluyes movimiento consciente. Caminar, respirar y movilizar el cuerpo te ayuda a liberar tensión y recuperar tu energía. Tu camino pasa por seguir habitando el cuerpo con más presencia.';
        } else {
            title = 'Conectada con el azul';
            description = 'Tienes una sensibilidad especial hacia la conexión interna y los espacios que te ayudan a volver a ti. El mar, la respiración y la presencia tienen un efecto profundo en tu estado interno. Tu bienestar crece cuando mantienes vivos tus rituales azules.';
        }

        return {
            mode: winner,
            title,
            description,
            scores: {
                calm: totalCalm,
                energy: totalEnergy,
                stress: totalStress
            },
            completionPercentage: Math.round((daysCompleted / 7) * 100)
        };
    }
};

import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

const openai = new OpenAI();

export const PatternAgent = {
    async generateDailyInsight(userId: string, currentDay: number): Promise<string | null> {
        // Only trigger on specific days to keep it special and ensure enough data
        if (currentDay !== 3 && currentDay !== 5) {
            return null;
        }

        const supabase = await createClient();

        // Fetch all reflections up to the current day
        const { data: reflections } = await supabase
            .from('reflections')
            .select('day, raw_text, sentiment_flag')
            .eq('user_id', userId)
            .lte('day', currentDay)
            .order('day', { ascending: true });

        // Need at least 2 reflections to form a pattern
        if (!reflections || reflections.length < 2) {
            return null;
        }

        const compiledData = reflections.map(r => `Día ${r.day} [Sentimiento: ${r.sentiment_flag}]: ${r.raw_text}`).join('\n');

        const PATTERN_SYSTEM_PROMPT = `
Eres el Observador de Patrones de Reset Azul.
Misión: Genera un "Lightweight Pattern Insight" basado en las reflexiones recientes del usuario.

REGLAS ESTRICTAS DE TONO:
- Observacional, calmado, humano, poético pero claro.
- NO uses etiquetas psicológicas (ej. no digas "ansiedad", "depresión", "evitación").
- NO uses lenguaje médico o terapéutico.
- NO afirmes certezas absolutas ("eres una persona que...", "tienes problemas con...").
- Usa fórmulas sutiles como: "Parece que...", "Tus reflexiones sugieren que...", "A lo largo de estos días se observa que...".
- MÁXIMO 2 frases cortas.
- Idioma: Español (España).

EJEMPLOS DE BUENOS INSIGHTS:
"Parece que encuentras la quietud más fácilmente cuando el ritmo exterior se suaviza."
"A lo largo de estos días, se observa que darle espacio al cuerpo te ayuda a reconectar rápido."
"Tus reflexiones sugieren una fuerte conexión con los rituales sencillos y silenciosos."

Datos del usuario:
${compiledData}
`;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: PATTERN_SYSTEM_PROMPT }
                ],
                temperature: 0.5,
            });

            return response.choices[0]?.message?.content?.trim() || null;
        } catch (error) {
            console.error('[PATTERN AGENT] Error generating insight:', error);
            return null;
        }
    }
};

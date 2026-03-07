import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

const openai = new OpenAI();

const RESULT_ENGINE_PROMPT = `
Eres el Motor de Resultados de Blue Reset.
Misión: Genera un "Lightweight Pattern Insight" como resumen final del viaje de 7 días del usuario.

REGLAS ESTRICTAS DE TONO:
- Observacional, calmado, humano, poético pero claro.
- NO uses etiquetas psicológicas.
- NO uses lenguaje médico o terapéutico.
- NO afirmes certezas absolutas ni suenes como un coach ("eres alguien que...", "has logrado...").
- Usa fórmulas sutiles: "A lo largo de estos días, parece que...", "Tus reflexiones sugieren...", "Se observa una tendencia hacia...".
- Conéctalo sutilmente con el agua o la quietud.
- MÁXIMO 2-3 frases cortas.
- Idioma: Español (España).

Los datos de entrada incluyen las reflexiones del usuario a lo largo del viaje.
`;

export const ResultEngine = {
    async generateSummary(userId: string): Promise<string> {
        const supabase = await createClient();

        const { data: reflections } = await supabase
            .from('reflections')
            .select('day, raw_text, sentiment_flag')
            .eq('user_id', userId)
            .order('day', { ascending: true });

        if (!reflections || reflections.length === 0) {
            return "Te has movido a través de estos siete días con una intención serena. Tu capacidad para comprometerte con este ritmo es una base sólida para lo que venga después.";
        }

        const compiledData = reflections.map(r => `Día ${r.day} [${r.sentiment_flag}]: ${r.raw_text}`).join('\n');

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: RESULT_ENGINE_PROMPT },
                    { role: 'user', content: `Journey Data:\n${compiledData}` }
                ],
                temperature: 0.4,
            });

            return response.choices[0]?.message?.content?.trim() || "Te has movido a través de estos siete días con una intención serena.";
        } catch (error) {
            return "Te has movido a través de estos siete días con una intención serena.";
        }
    }
};

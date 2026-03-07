import OpenAI from 'openai';
import { EventType } from '../events/schema';

// We initialize openai without apiKey, it will default to process.env.OPENAI_API_KEY
const openai = new OpenAI();

const REGULATION_SYSTEM_PROMPT = `
Eres el Agente de Regulación del Sistema Nervioso.
Misión: Analiza el sentimiento del texto para proteger el ritmo emocional del usuario.
Debes devolver un objeto JSON con exactamente una clave: "sentiment_flag".
El valor debe ser uno de: "calm", "neutral", "low_emotion".

Guía de decisión:
- Si el texto usa palabras como estresado, abrumado, odio, cansado, ansioso -> "low_emotion"
- Si el texto usa palabras como paz, centrado, respirar, mejor -> "calm"
- De lo contrario, o si está vacío -> "neutral"
`;

export const RegulationAgent = {
    async analyzeSentiment(text: string): Promise<'calm' | 'neutral' | 'low_emotion'> {
        if (!text || text.trim() === '') return 'neutral';

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: REGULATION_SYSTEM_PROMPT },
                    { role: 'user', content: text }
                ],
                response_format: { type: 'json_object' },
                temperature: 0,
            });

            const content = response.choices[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                const flag = parsed.sentiment_flag;
                if (['calm', 'neutral', 'low_emotion'].includes(flag)) {
                    return flag;
                }
            }
            return 'neutral';
        } catch (error) {
            console.error('[REGULATION AGENT] Error:', error);
            // Fallback to neutral to not halt the system
            return 'neutral';
        }
    }
};

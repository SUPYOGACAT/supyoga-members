import { SystemEvent } from '../events/schema';
import { EventBus } from '../events/bus';
import { StateManager } from './state_manager';
import { GamificationAgent } from './gamification';
import { RegulationAgent } from './regulation';
import { CompanionAgent } from './companion';
import { PatternAgent } from './pattern';
import { blueResetJourney, dayZeroModule } from '../../data/journey';

// The Orchestrator acts as the main routing switch that processes incoming events.
export const Orchestrator = {
    async processEvent(event: SystemEvent) {
        console.log(`[ORCHESTRATOR] Processing: ${event.action_type} for ${event.user_id}`);

        const { user_id, action_type, payload } = event;
        const { state, user } = await StateManager.getFullState(user_id);

        if (!state) {
            console.error(`[ORCHESTRATOR] User state not found for ${user_id}`);
            return;
        }

        // 1. Log the event
        await StateManager.logEvent(user_id, action_type, payload);

        // 2. Safety & Conflict Checks (The Nervous System Regulation check)
        if (action_type === 'VIDEO_COMPLETED') {
            const duration = payload.duration_seconds || 0;
            if (duration < 10) {
                await EventBus.publish('system_alerts', {
                    ...event,
                    action_type: 'RUSHING_DETECTED',
                    source: 'orchestrator'
                });
                return {
                    handled: true,
                    message: "There is no rush here. Take a breath and let the content play fully when you have the time.",
                    pointsAwarded: 0
                };
            }
        }

        // 3. LLM Processing on Reflection
        let companionReply = "";
        let patternInsight: string | null = null;
        if (action_type === 'REFLECTION_SUBMITTED') {
            // Extract scores and text
            const text = payload.text || "";
            const energy_score = payload.energy_score || null;
            const calm_score = payload.calm_score || null;
            const connection_score = payload.connection_score || null;
            
            const sentiment = await RegulationAgent.analyzeSentiment(text || 'Sin texto');

            // Update reflection state with sentiment and scores in db
            const supabase = await (await import('@/utils/supabase/server')).createClient();
            let currentDay = parseInt(state.current_stage.replace(/\D/g, '')) || 1;
            if (state.current_stage === 'NotStarted') currentDay = 0;

            await supabase.from('reflections').insert({
                user_id,
                day: currentDay,
                raw_text: text,
                sentiment_flag: sentiment,
                energy_score,
                calm_score,
                connection_score
            });

            // Fetch previous day's reflection
            let previousContext = null;
            if (currentDay > 1) {
                const { data: previousReflections } = await supabase
                    .from('reflections')
                    .select('raw_text, sentiment_flag')
                    .eq('user_id', user_id)
                    .eq('day', currentDay - 1)
                    .order('created_at', { ascending: false })
                    .limit(1);

                const previousReflection = previousReflections?.[0];

                if (previousReflection) {
                    previousContext = {
                        text: previousReflection.raw_text,
                        sentiment: previousReflection.sentiment_flag
                    };
                }
            }

            // Now trigger Companion with context
            const dayContext = currentDay === 0 ? dayZeroModule : blueResetJourney.find(d => d.day === currentDay);
            companionReply = await CompanionAgent.generateResponse(
                user?.name || "explorador/a",
                dayContext?.theme || "Pausa",
                text,
                {
                    isLowEmotion: sentiment === 'low_emotion',
                    isReturning: false,
                    previousContext
                }
            );

            // Generate Daily Pattern Insight (runs in parallel if desired, but we'll await it here for simplicity)
            patternInsight = await PatternAgent.generateDailyInsight(user_id, currentDay);

            // Emit internal event 
            if (sentiment === 'low_emotion' || sentiment === 'calm') {
                await EventBus.publish('emotional_markers', {
                    ...event,
                    action_type: sentiment === 'low_emotion' ? 'EMOTION_LOW' : 'EMOTION_CALM',
                    source: 'regulation_agent'
                });
            }
        }

        // 4. Routing valid actions to Gamification
        let actionValidatedCount = 0;
        if (['VIDEO_COMPLETED', 'PRACTICE_COMPLETED', 'MICRO_ACTION_LOGGED', 'REFLECTION_SUBMITTED'].includes(action_type)) {
            await GamificationAgent.handleActionValidated(user_id, action_type, state.current_streak > 0);
            actionValidatedCount++;
        }

        // 5. State Transitions (Day progression)
        if (action_type === 'REFLECTION_SUBMITTED') {
            if (state.current_stage === 'NotStarted') {
                await StateManager.advanceStage(user_id, 'ActiveDay1');
            } else {
                const currentDay = parseInt(state.current_stage.replace(/\D/g, '')) || 1;
                let nextState = `CompletedDay${currentDay}`;
                if (currentDay === 7) nextState = 'CompletedReset';
                await StateManager.advanceStage(user_id, nextState);
            }
        }

        if (action_type === 'START_NEXT_DAY') {
            if (state.current_stage.startsWith('CompletedDay')) {
                const currentDay = parseInt(state.current_stage.replace('CompletedDay', '')) || 1;
                if (currentDay < 7) {
                    await StateManager.advanceStage(user_id, `ActiveDay${currentDay + 1}`);
                }
            } else if (state.current_stage === 'NotStarted') {
                await StateManager.advanceStage(user_id, 'ActiveDay1');
            }
        }

        return {
            handled: true,
            actionValidatedCount,
            companionResponse: companionReply || null,
            patternInsight
        };
    }
};

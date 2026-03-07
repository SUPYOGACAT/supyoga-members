import { createClient } from '@/utils/supabase/server';

export const StateManager = {
    async getFullState(userId: string) {
        const supabase = await createClient();

        const [userRes, stateRes, logRes] = await Promise.all([
            supabase.from('users').select('*').eq('id', userId).single(),
            supabase.from('user_states').select('*').eq('user_id', userId).single(),
            supabase.from('session_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
        ]);

        return {
            user: userRes.data,
            state: stateRes.data,
            recentLogs: logRes.data
        };
    },

    async updateDropsAndStreak(userId: string, addedDrops: number, streakReset: boolean = false) {
        const supabase = await createClient();

        // Fetch current to calculate safe increment without race conditions using RPC or direct read/write if traffic is low.
        const { data: current } = await supabase.from('user_states').select('water_drops, current_streak').eq('user_id', userId).single();
        if (!current) return;

        const updatePayload: any = {
            water_drops: current.water_drops + addedDrops,
            updated_at: new Date().toISOString()
        };

        if (streakReset) {
            updatePayload.current_streak = 0;
        } else {
            updatePayload.current_streak = current.current_streak + 1;
        }

        await supabase.from('user_states').update(updatePayload).eq('user_id', userId);
    },

    async logEvent(userId: string, eventType: string, metadata: any, duration?: number) {
        const supabase = await createClient();
        await supabase.from('session_logs').insert({
            user_id: userId,
            event_type: eventType,
            duration_seconds: duration,
            metadata
        });
    },

    async advanceStage(userId: string, newStage: string) {
        const supabase = await createClient();
        console.log(`[STATE] Updating stage to ${newStage} for ${userId}`);
        const { error } = await supabase.from('user_states').update({
            current_stage: newStage,
            updated_at: new Date().toISOString()
        }).eq('user_id', userId);

        if (error) {
            console.error(`[STATE ERROR] Failed to advance stage: `, error);
        }
    }
};

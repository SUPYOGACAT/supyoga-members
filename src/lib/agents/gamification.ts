import { StateManager } from './state_manager';
import { EventBus } from '../events/bus';

const POINTS = {
    VIDEO: 10,
    PRACTICE: 20,
    MICRO_ACTION: 15,
    REFLECTION: 15,
};

const DAILY_CAP = 50;

export const GamificationAgent = {
    async handleActionValidated(userId: string, actionType: string, streakMultiplierActive: boolean) {
        let earned = 0;

        switch (actionType) {
            case 'VIDEO_COMPLETED':
                earned = POINTS.VIDEO;
                break;
            case 'PRACTICE_COMPLETED':
                earned = POINTS.PRACTICE;
                break;
            case 'MICRO_ACTION_LOGGED':
                earned = POINTS.MICRO_ACTION;
                break;
            case 'REFLECTION_SUBMITTED':
                earned = POINTS.REFLECTION;
                break;
        }

        if (earned > 0) {
            if (streakMultiplierActive) {
                earned = Math.floor(earned * 1.2);
            }

            // In a real scenario, check against DAILY_CAP based on logs.
            await StateManager.updateDropsAndStreak(userId, earned, false);

            // Emit internal event for UI updates
            await EventBus.publish('ui_updates', {
                event_id: `score_update_${Date.now()}`,
                source: 'gamification_agent',
                timestamp: new Date().toISOString(),
                user_id: userId,
                action_type: 'SCORE_UPDATED',
                payload: { drops_added: earned }
            });
        }
    },

    async handleStreakReset(userId: string) {
        await StateManager.updateDropsAndStreak(userId, 0, true);
    }
};

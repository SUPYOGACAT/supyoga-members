export type EventPayload = Record<string, unknown>;

export type EventType =
    | 'SESSION_START'
    | 'VIDEO_COMPLETED'
    | 'PRACTICE_COMPLETED'
    | 'MICRO_ACTION_LOGGED'
    | 'REFLECTION_SUBMITTED'
    | 'RUSHING_DETECTED'
    | 'PACING_OK'
    | 'SCORE_UPDATED'
    | 'EMOTION_LOW'
    | 'EMOTION_NEUTRAL'
    | 'EMOTION_CALM'
    | 'TRIGGER_COMPANION_RESPONSE'
    | 'START_NEXT_DAY';

export interface SystemEvent {
    event_id: string;
    source: string;
    timestamp: string;
    user_id: string;
    action_type: EventType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: {
        text?: string;
        energy_score?: number;
        calm_score?: number;
        stress_score?: number;
        [key: string]: any;
    };
}

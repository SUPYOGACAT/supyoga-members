import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Orchestrator } from '@/lib/agents/orchestrator';
import { EventBus } from '@/lib/events/bus';
import { EventType } from '@/lib/events/schema';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { action_type, payload } = body;

        const systemEvent = {
            event_id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            source: 'client_ui',
            timestamp: new Date().toISOString(),
            user_id: user.id,
            action_type: action_type as EventType,
            payload: payload || {}
        };

        // Push into Upstash Redis for audit/background
        await EventBus.publish('orchestrator_events', systemEvent);

        // MVP Synchronous Processing to guarantee fast UI response
        const result = await Orchestrator.processEvent(systemEvent);

        return NextResponse.json({ success: true, event_type: action_type, process_result: result });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Invalid payload or server error' }, { status: 500 });
    }
}

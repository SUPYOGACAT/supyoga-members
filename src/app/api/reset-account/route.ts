import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'No estás logueado. Inicia sesión primero.' }, { status: 401 });
    }

    // Reset user state to Day 1
    const { error } = await supabase.from('user_states').update({
        current_stage: 'ActiveDay1',
        current_streak: 0,
        water_drops: 0
    }).eq('user_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: 'Tu cuenta ha sido reseteada al Día 1. Ya puedes volver al Dashboard.',
        action: 'Ve a http://localhost:3000/dashboard'
    });
}

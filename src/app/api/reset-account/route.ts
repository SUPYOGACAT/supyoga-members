import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'No estás logueado. Inicia sesión primero.' }, { status: 401 });
    }

    // Reset user state to NotStarted
    const { error } = await supabase.from('user_states').update({
        current_stage: 'NotStarted',
        current_streak: 0,
        water_drops: 0
    }).eq('user_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: 'Tu cuenta ha sido reseteada al Inicio (Día 0). Ya puedes volver al Dashboard.',
        action: 'Refresca la página del dashboard.'
    });
}

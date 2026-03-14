'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLogin(formData: FormData) {
    const password = formData.get('password') as string
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
        throw new Error('ADMIN_PASSWORD not configured')
    }

    if (password === adminPassword) {
        const cookieStore = await cookies()
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/'
        })
        redirect('/admin')
    } else {
        redirect('/admin/login?error=1')
    }
}

export async function adminLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/admin/login')
}

export async function resetUserProgress(userId: string) {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')
    if (!session || session.value !== 'authenticated') {
        throw new Error('Unauthorized')
    }

    const { createAdminClient } = await import('@/utils/supabase/admin')
    const supabase = createAdminClient()

    try {
        // Delete all user progress tracking tables
        await supabase.from('reflections').delete().eq('user_id', userId)
        await supabase.from('companion_interactions').delete().eq('user_id', userId)
        await supabase.from('events').delete().eq('user_id', userId)
        
        // Reset the state to NotStarted
        await supabase.from('user_states').update({
            current_stage: 'NotStarted',
            water_drops: 0,
            current_streak: 0,
            active_day: 0,
            current_stage_completed: false
        }).eq('user_id', userId)

    } catch (error) {
        console.error('[ADMIN] Error resetting user:', error)
        throw new Error('Failed to reset user')
    }
}

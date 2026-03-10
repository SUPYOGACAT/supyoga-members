import { createClient } from '@supabase/supabase-js'

// This client bypasses RLS using the service role key.
// NEVER use this client in client-side code (no 'use client' files).
// Only for server-side admin operations.
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!serviceRoleKey) {
        throw new Error('[ADMIN] SUPABASE_SERVICE_ROLE_KEY is not set.')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

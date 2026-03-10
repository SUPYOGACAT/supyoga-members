import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('[AUTH CALLBACK] Error exchanging code for session:', error.message)
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('El enlace de confirmación es inválido o ha expirado. Prueba a iniciar sesión o regístrate de nuevo.')}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('No se encontró el código de verificación.')}`)
}

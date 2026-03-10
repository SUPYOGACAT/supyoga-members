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

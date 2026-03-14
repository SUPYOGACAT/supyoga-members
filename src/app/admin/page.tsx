import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import AdminTableClient from './AdminTableClient'
import { adminLogout } from './actions'

// Simulated members to showcase the dashboard design
const SIMULATED_MEMBERS = [
    {
        id: 'sim-1',
        name: 'Marta Villena',
        email: 'marta.v@ejemplo.com',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        current_stage: 'CompletedReset',
        water_drops: 14,
        current_streak: 7,
        last_interaction: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'sim-2',
        name: 'Jordi Puig',
        email: 'jordi.p@ejemplo.com',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        current_stage: 'CompletedDay4',
        water_drops: 9,
        current_streak: 4,
        last_interaction: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'sim-3',
        name: 'Ana Carmona',
        email: 'ana.carmona@ejemplo.com',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        current_stage: 'ActiveDay2',
        water_drops: 4,
        current_streak: 2,
        last_interaction: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'sim-4',
        name: 'Pau Ferrer',
        email: 'pau.ferrer@ejemplo.com',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        current_stage: 'CompletedReset',
        water_drops: 16,
        current_streak: 7,
        last_interaction: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'sim-5',
        name: 'Silvia Torres',
        email: 'silvia.t@ejemplo.com',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        current_stage: 'NotStarted',
        water_drops: 0,
        current_streak: 0,
        last_interaction: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
]

export default async function AdminPage() {
    // Check admin session cookie
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session || session.value !== 'authenticated') {
        redirect('/admin/login')
    }

    // Fetch real members using service role (bypasses RLS)
    let realMembers: typeof SIMULATED_MEMBERS = []
    try {
        const supabase = createAdminClient()
        const { data: users } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .order('created_at', { ascending: false })

        if (users && users.length > 0) {
            const userIds = users.map(u => u.id)
            const { data: states } = await supabase
                .from('user_states')
                .select('user_id, current_stage, water_drops, current_streak, last_interaction')
                .in('user_id', userIds)

            realMembers = users.map(u => {
                const state = states?.find(s => s.user_id === u.id)
                return {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    created_at: u.created_at,
                    current_stage: state?.current_stage || 'NotStarted',
                    water_drops: state?.water_drops || 0,
                    current_streak: state?.current_streak || 0,
                    last_interaction: state?.last_interaction || u.created_at,
                }
            })
        }
    } catch (e) {
        console.error('[ADMIN] Error fetching members:', e)
    }

    // Merge real members with simulated ones (simulated appear after real)
    const allMembers = [...realMembers, ...SIMULATED_MEMBERS]

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1826] to-[#0d2136] text-slate-200 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex justify-between items-start mb-16">
                    <div>
                        <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.3em] text-blue-200/30 hover:text-blue-200/60 transition-colors">
                            ← Volver al Dashboard
                        </Link>
                        <h1 className="text-3xl font-normal text-[#E6F0FF] mt-3 tracking-wide">Panel de administración</h1>
                        <p className="text-slate-300 font-normal text-sm mt-1">Blue Reset · Miembros</p>
                    </div>
                    <form action={adminLogout}>
                        <button type="submit" className="text-[10px] uppercase tracking-[0.25em] text-slate-500 hover:text-red-400 transition-colors">
                            Cerrar sesión admin
                        </button>
                    </form>
                </header>

                {/* Simulated data notice */}
                <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl px-6 py-4 mb-8 flex items-start gap-4">
                    <span className="text-amber-400/70 text-lg mt-0.5">◆</span>
                    <div>
                        <p className="text-amber-300/80 text-sm font-normal">
                            <strong className="font-medium">Datos de simulación activos.</strong> Los últimos {SIMULATED_MEMBERS.length} miembros de la tabla son ficticios para ilustrar el funcionamiento del panel.
                            {realMembers.length > 0 ? ` Se muestran ${realMembers.length} miembros reales.` : ' Aún no hay miembros reales registrados.'}
                        </p>
                    </div>
                </div>

                {/* Admin Table */}
                <AdminTableClient members={allMembers} />
            </div>
        </div>
    )
}

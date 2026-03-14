'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resetUserProgress } from './actions'

interface Member {
    id: string
    name: string | null
    email: string | null
    created_at: string
    current_stage: string
    water_drops: number
    current_streak: number
    last_interaction: string
}

function getStatusLabel(stage: string): { label: string; color: string } {
    if (stage === 'CompletedReset') return { label: '✓ Completado', color: 'text-emerald-400' }
    if (stage === 'NotStarted') return { label: 'Sin empezar', color: 'text-slate-500' }
    if (stage.startsWith('ActiveDay')) {
        const day = stage.replace('ActiveDay', '')
        return { label: `Día ${day} (activo)`, color: 'text-blue-400' }
    }
    if (stage.startsWith('CompletedDay')) {
        const day = stage.replace('CompletedDay', '')
        return { label: `Día ${day} completado`, color: 'text-blue-300' }
    }
    return { label: stage, color: 'text-slate-400' }
}

function getDayNumber(stage: string): number {
    if (stage === 'CompletedReset') return 7
    if (stage === 'NotStarted') return 0
    const match = stage.match(/\d+/)
    return match ? parseInt(match[0]) : 0
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

function downloadCSV(members: Member[]) {
    const headers = ['Nombre', 'Email', 'Fecha de alta', 'Día actual', 'Estado', 'Gotas de agua', 'Racha actual', 'Última actividad']
    const rows = members.map(m => [
        m.name || '—',
        m.email || '—',
        formatDate(m.created_at),
        getDayNumber(m.current_stage),
        getStatusLabel(m.current_stage).label,
        m.water_drops,
        m.current_streak,
        formatDate(m.last_interaction)
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blue-reset-miembros-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

export default function AdminTableClient({ members }: { members: Member[] }) {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'notstarted'>('all')
    const [search, setSearch] = useState('')
    const [isResetting, setIsResetting] = useState<string | null>(null)
    const router = useRouter()

    const handleReset = async (userId: string, userName: string | null) => {
        if (!confirm(`¿Estás seguro de querer resetear el progreso de ${userName || 'este usuario'}? Perderá todas sus reflexiones y volverá al Día 0. Esta acción no se puede deshacer.`)) return
        
        setIsResetting(userId)
        try {
            await resetUserProgress(userId)
            router.refresh()
        } catch (error) {
            alert('Ha ocurrido un error al intentar resetear al usuario.')
            console.error(error)
        } finally {
            setIsResetting(null)
        }
    }

    const filteredMembers = members.filter(m => {
        const matchesSearch = !search ||
            (m.name?.toLowerCase().includes(search.toLowerCase())) ||
            (m.email?.toLowerCase().includes(search.toLowerCase()))

        const matchesFilter =
            filter === 'all' ||
            (filter === 'completed' && m.current_stage === 'CompletedReset') ||
            (filter === 'active' && (m.current_stage.startsWith('ActiveDay') || m.current_stage.startsWith('CompletedDay'))) ||
            (filter === 'notstarted' && m.current_stage === 'NotStarted')

        return matchesSearch && matchesFilter
    })

    const completedCount = members.filter(m => m.current_stage === 'CompletedReset').length
    const activeCount = members.filter(m => m.current_stage.startsWith('ActiveDay') || m.current_stage.startsWith('CompletedDay')).length
    const notStartedCount = members.filter(m => m.current_stage === 'NotStarted').length

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Total miembros', value: members.length, color: 'text-[#E6F0FF]' },
                    { label: 'Completaron el reset', value: completedCount, color: 'text-emerald-400' },
                    { label: 'En progreso', value: activeCount, color: 'text-blue-400' },
                    { label: 'Sin empezar', value: notStartedCount, color: 'text-slate-400' },
                ].map(stat => (
                    <div key={stat.label} className="bg-[#0b1a29]/40 border border-[#1a365d]/30 rounded-2xl p-6">
                        <div className={`text-3xl font-normal mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters + Export */}
            <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
                <div className="flex gap-2 items-center flex-wrap">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-[#0b1a29]/60 border border-[#1a365d]/40 text-[#E6F0FF] rounded-xl px-4 py-2 outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600 font-normal text-sm w-64"
                    />
                    {(['all', 'active', 'completed', 'notstarted'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-widest border transition-colors ${filter === f
                                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                                    : 'bg-transparent border-[#1a365d]/30 text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {f === 'all' ? 'Todos' : f === 'active' ? 'En progreso' : f === 'completed' ? 'Completados' : 'Sin empezar'}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => downloadCSV(filteredMembers)}
                    className="px-6 py-2 bg-blue-600/15 hover:bg-blue-600/25 text-[#E6F0FF] border border-blue-500/30 rounded-xl transition-all duration-300 font-normal tracking-widest uppercase text-xs flex items-center gap-2"
                >
                    <span>⬇</span>
                    Exportar CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#0b1a29]/40 border border-[#1a365d]/30 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1a365d]/30">
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">Nombre</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">Email</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">Alta</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">Día</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">Estado</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">💧 Gotas</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">Última actividad</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-slate-500 font-normal">
                                        No hay miembros que coincidan con el filtro.
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((member, i) => {
                                    const status = getStatusLabel(member.current_stage)
                                    const dayNum = getDayNumber(member.current_stage)

                                    return (
                                        <tr
                                            key={member.id}
                                            className={`border-b border-[#1a365d]/20 hover:bg-blue-900/10 transition-colors ${i % 2 === 0 ? '' : 'bg-[#0a1520]/20'}`}
                                        >
                                            <td className="px-6 py-4 text-[#E6F0FF] font-normal">
                                                {member.name || <span className="text-slate-500 italic">Sin nombre</span>}
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 font-normal">{member.email || '—'}</td>
                                            <td className="px-6 py-4 text-slate-300 font-normal tabular-nums">{formatDate(member.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                                                            <div
                                                                key={d}
                                                                className={`w-2 h-2 rounded-full ${d <= dayNum
                                                                        ? member.current_stage === 'CompletedReset' ? 'bg-emerald-500' : 'bg-blue-500'
                                                                        : 'bg-slate-700'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-slate-400 text-xs">{dayNum}/7</span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 font-normal text-xs ${status.color}`}>{status.label}</td>
                                            <td className="px-6 py-4 text-blue-300 font-normal tabular-nums">{member.water_drops}</td>
                                            <td className="px-6 py-4 text-slate-300 font-normal tabular-nums text-xs">{formatDate(member.last_interaction)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleReset(member.id, member.name)}
                                                    disabled={isResetting === member.id}
                                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                >
                                                    {isResetting === member.id ? 'Reseteando...' : 'Reset'}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-center text-slate-600 text-xs mt-6">
                Mostrando {filteredMembers.length} de {members.length} miembros
            </p>
        </div>
    )
}

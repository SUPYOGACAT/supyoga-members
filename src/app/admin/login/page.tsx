import { adminLogin } from '../actions'

export default async function AdminLoginPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams
    const hasError = params.error === '1'

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1826] to-[#0d2136] flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-12">
                    <span className="text-[11px] uppercase tracking-[0.4em] text-blue-200/40">Blue Reset</span>
                    <h1 className="text-2xl font-normal text-[#E6F0FF] mt-3 tracking-wide">Panel de administración</h1>
                </div>

                {/* Login Form */}
                <form action={adminLogin} className="space-y-4">
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.25em] text-slate-300 mb-3">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            autoFocus
                            className="w-full bg-[#0b1a29]/60 border border-[#1a365d]/50 text-[#E6F0FF] rounded-xl px-5 py-4 outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600 font-normal text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {hasError && (
                        <p className="text-red-400/70 text-xs text-center tracking-wide">
                            Contraseña incorrecta. Inténtalo de nuevo.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600/15 hover:bg-blue-600/25 text-[#E6F0FF] border border-blue-500/30 rounded-xl transition-all duration-300 font-normal tracking-widest uppercase text-xs mt-2"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}

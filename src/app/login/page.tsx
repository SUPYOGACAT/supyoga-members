import { login, signup } from './actions'
import Footer from '../components/Footer'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#07131e] text-slate-200 px-6 py-12">
            <div className="max-w-md w-full p-8 md:p-10 rounded-3xl bg-[#0b1a29]/80 backdrop-blur-sm shadow-2xl border border-[#1a365d] mb-auto mt-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extralight text-[#E6F0FF] tracking-wide mb-3">BLUE RESET</h1>
                    <p className="text-[#9FB3CC] font-light text-sm tracking-wide">Vuelve a tu centro</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.25em] text-[#9FB3CC] mb-3" htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-[#0d2136]/50 border border-[#1e3a5f]/50 rounded-xl px-5 py-4 text-[#E6F0FF] font-light text-sm focus:outline-none focus:border-blue-400/50 focus:bg-[#0d2136] transition-colors placeholder:text-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.25em] text-[#9FB3CC] mb-3" htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full bg-[#0d2136]/50 border border-[#1e3a5f]/50 rounded-xl px-5 py-4 text-[#E6F0FF] font-light text-sm focus:outline-none focus:border-blue-400/50 focus:bg-[#0d2136] transition-colors placeholder:text-slate-600"
                        />
                    </div>

                    <div className="pt-6 flex flex-col gap-4">
                        <button
                            formAction={login}
                            className="w-full py-4 px-4 bg-blue-600/15 hover:bg-blue-600/25 text-[#E6F0FF] border border-blue-500/30 rounded-full transition-all duration-300 font-light tracking-widest uppercase text-xs shadow-lg shadow-blue-900/20"
                        >
                            Entrar al programa
                        </button>
                        <button
                            formAction={signup}
                            className="w-full py-4 px-4 bg-transparent border border-[#1e3a5f]/50 hover:bg-[#1e3a5f]/30 text-[#9FB3CC] rounded-full transition-colors font-light tracking-widest uppercase text-xs"
                        >
                            Empezar un nuevo viaje
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-12">
                <Footer />
            </div>
        </div>
    )
}

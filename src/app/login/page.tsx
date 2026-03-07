import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#07131e] text-slate-200">
            <div className="max-w-md w-full p-8 rounded-2xl bg-[#0b1a29] shadow-2xl border border-[#1a365d]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-light text-blue-100 tracking-wide mb-2">BLUE RESET</h1>
                    <p className="text-slate-400 text-sm">Return to your center</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2" htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-[#0d2136] border border-[#1e3a5f] rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full bg-[#0d2136] border border-[#1e3a5f] rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex flex-col gap-4">
                        <button
                            formAction={login}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium tracking-wide shadow-lg shadow-blue-900/20"
                        >
                            Enter Journey
                        </button>
                        <button
                            formAction={signup}
                            className="w-full py-3 px-4 bg-transparent border border-[#1e3a5f] hover:bg-[#1e3a5f]/50 text-slate-300 rounded-lg transition-colors text-sm"
                        >
                            Begin a New Journey
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

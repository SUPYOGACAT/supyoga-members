import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { welcomeModule } from '@/data/journey'
import Footer from './components/Footer'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1826] via-[#0d2136] to-[#0a1826] text-slate-200 selection:bg-blue-900/30 font-normal overflow-hidden">
      {/* Navigation */}
      <header className="flex justify-between items-center p-6 md:p-10 max-w-6xl mx-auto">
        <span className="text-sm font-normal text-blue-200/60 tracking-[0.3em] uppercase">Blue Reset</span>
        <Link
          href="/login"
          className="text-[11px] uppercase tracking-[0.25em] text-blue-200/80 hover:text-blue-200 transition-colors"
        >
          Iniciar sesión
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 md:pt-32 pb-32 text-center">
        {/* Tag */}
        <div className="inline-block mb-10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-blue-400/80 border border-blue-500/20 rounded-full px-5 py-2">
            7 días · Blue Health
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-normal text-[#E6F0FF] mb-8 tracking-tighter leading-[0.95] opacity-95">
          Resetea<br />
          <span className="text-blue-300/70">desde dentro</span>
        </h1>

        {/* Description */}
        <p className="text-slate-200 text-xl md:text-2xl font-normal leading-[1.6] max-w-xl mx-auto mb-4">
          Un programa de 7 días para calmar el sistema nervioso, restaurar la energía y reconectar con lo esencial.
        </p>
        <p className="text-slate-300 text-base md:text-lg font-normal mb-16 max-w-lg mx-auto">
          Inspirado en el entorno acuático. Diseñado para tu vida real.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="px-10 py-4 bg-blue-600/15 hover:bg-blue-600/25 text-[#E6F0FF] border border-blue-500/30 rounded-full transition-all duration-500 font-normal tracking-widest uppercase text-xs shadow-lg shadow-blue-900/20 hover:shadow-blue-500/10 hover:-translate-y-0.5"
          >
            Comenzar mi reset →
          </Link>
        </div>

        {/* Video Preview */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050c14] z-10 pointer-events-none rounded-[32px]"></div>
          <div className="bg-[#0b1a29]/40 backdrop-blur-xl rounded-[32px] border border-[#1a365d]/30 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] relative">
            {/* Video embed */}
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(welcomeModule.videoUrl)}?modestbranding=1&rel=0&color=white&iv_load_policy=3`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Blue Reset - Bienvenida"
              />
            </div>
          </div>
        </div>
      </main>

      {/* What you'll get */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-blue-400/30 mb-16">Incluye</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🌊', title: '7 prácticas guiadas', text: 'Respiración, movimiento, meditación y escaneo corporal. Todo lo que el sistema nervioso necesita.' },
            { icon: '🧭', title: 'Un Compañero IA', text: 'Recibe respuestas personalizadas y continuadas basadas en tus propias reflexiones diarias.' },
            { icon: '✦', title: 'Rituales de 5 minutos', text: 'Micro-hábitos sencillos para llevar la práctica a tu vida cotidiana sin esfuerzo.' },
          ].map((item) => (
            <div key={item.title} className="text-center px-6 py-10 bg-[#0b1a29]/30 border border-[#1a365d]/20 rounded-3xl">
              <div className="text-3xl mb-4 opacity-70">{item.icon}</div>
              <h3 className="text-[#E6F0FF] font-normal text-lg mb-3">{item.title}</h3>
              <p className="text-slate-300 font-normal text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <Link
          href="/login"
          className="inline-block px-10 py-4 bg-blue-600/15 hover:bg-blue-600/25 text-[#E6F0FF] border border-blue-500/30 rounded-full transition-all duration-500 font-normal tracking-widest uppercase text-xs shadow-lg shadow-blue-900/20 hover:shadow-blue-500/10 hover:-translate-y-0.5 mb-8"
        >
          Empezar ahora →
        </Link>
        <p className="text-slate-300/40 text-xs tracking-widest">Blue Reset by SupYoga Barcelona</p>
      </footer>
    </div>
  )
}

function getYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/)
  return match ? match[1] : ''
}

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
        <span className="text-sm font-normal text-blue-200/60 tracking-[0.3em] uppercase">Reset Azul</span>
        <Link
          href="/login"
          className="text-[11px] uppercase tracking-[0.25em] text-blue-200/80 hover:text-blue-200 transition-colors"
        >
          Iniciar sesión
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl mx-auto px-6 pt-20 md:pt-32 pb-12 text-center">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-normal text-blue-300 mb-12 tracking-tight leading-tight opacity-95">
          Bienvenida al<br />
          <span className="text-[#E6F0FF]">Reset Azul</span>
        </h1>

        {/* Video Preview */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1826] z-10 pointer-events-none rounded-[32px]"></div>
          <div className="bg-[#0b1a29]/40 backdrop-blur-xl rounded-[32px] border border-[#1a365d]/30 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] relative">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(welcomeModule.videoUrl)}?modestbranding=1&rel=0&color=white&iv_load_policy=3`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Reset Azul - Bienvenida"
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-2xl mx-auto text-left md:text-center text-slate-200 text-lg md:text-xl font-normal leading-[1.8] space-y-8 mb-20 bg-[#0b1a29]/20 p-8 md:p-12 rounded-3xl border border-[#1a365d]/20 shadow-xl">
          <p>
            Durante los próximos 7 días vas a experimentar pequeñas prácticas de 5-15 minutos inspiradas en la <strong className="font-medium text-blue-300">Salud Azul</strong>, un enfoque que estudia cómo el contacto con el agua y los entornos naturales ayudan a regular el sistema nervioso, reducir el estrés y mejorar nuestro bienestar.
          </p>
          <div className="py-2 border-y border-[#1a365d]/30">
            <p className="py-2">No necesitas experiencia previa.</p>
            <p className="py-2">Y tampoco necesitas vivir cerca del mar.</p>
          </div>
          <div>
            <p className="mb-5 text-slate-300">Cada día tendrás una práctica breve que podrás hacer:</p>
            <ul className="flex flex-col md:flex-row justify-center gap-4 md:gap-12 text-blue-200/90 font-medium tracking-wide">
              <li className="flex items-center gap-3 justify-start md:justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                frente al mar
              </li>
              <li className="flex items-center gap-3 justify-start md:justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                o desde casa
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="inline-block px-12 py-5 bg-blue-600/15 hover:bg-blue-600/30 text-[#E6F0FF] border border-blue-500/30 hover:border-blue-400/50 rounded-full transition-all duration-500 font-medium tracking-widest uppercase text-sm shadow-[0_0_30px_-5px_rgba(37,99,235,0.2)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.4)] hover:-translate-y-1 mb-16"
        >
          Iniciar mi experiencia →
        </Link>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 pb-12 text-center">
        <p className="text-slate-300/40 text-xs tracking-widest">Reset by SUPYOGA.CAT</p>
      </footer>
    </div>
  )
}

function getYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/)
  return match ? match[1] : ''
}

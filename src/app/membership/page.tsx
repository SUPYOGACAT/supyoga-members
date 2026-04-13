import React from 'react';
import VideoPlayer from '../dashboard/VideoPlayer';
import Link from 'next/link';
import Footer from '../components/Footer';
import UserMenu from '../dashboard/UserMenu';
import DaySevenResult from '../dashboard/DaySevenResult';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ResultEngine } from '@/lib/agents/result_engine';

export default async function MembershipLandingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch the calculated profile
    const resultSummary = await ResultEngine.generateSummary(user.id);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1826] to-[#0d2136] text-slate-200 p-6 md:p-12 selection:bg-blue-900/30 font-normal">
            <header className="flex justify-between items-center mb-16 max-w-4xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-700">
                <Link href="/dashboard" className="text-sm font-normal text-blue-200 tracking-[0.3em] mix-blend-screen hover:text-white transition-colors">START RESET AZUL</Link>
                <div className="flex items-center gap-6 z-50">
                    <UserMenu userName={user.user_metadata?.name || undefined} />
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-16">
                <section className="bg-[#0b1a29]/40 backdrop-blur-xl p-8 md:p-16 rounded-[40px] border border-[#1a365d]/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-1000 max-w-4xl mx-auto">
                    <div className="absolute -top-64 -right-64 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

                    {/* Final Result Profile Injection */}
                    <div className="mb-20">
                        <DaySevenResult summary={resultSummary} />
                    </div>

                    <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 border-t border-[#1a365d]/50 pt-20">
                        <h2 className="text-4xl md:text-6xl font-normal text-[#E6F0FF] mb-10 tracking-tighter opacity-95 leading-tight">
                            ¿Y si esto no fuera solo un reto de 7 días?
                        </h2>
                    </div>

                    {/* Video Section */}
                    <div className="mb-20">
                        <VideoPlayer url="https://youtu.be/-6_5QArM2hM" />
                    </div>

                    <div className="max-w-2xl mx-auto space-y-12 text-slate-200 text-lg md:text-xl font-light leading-relaxed">
                        
                        <div className="space-y-6">
                            <p>Si durante esta semana has sentido:</p>
                            <ul className="list-disc pl-6 space-y-3 text-blue-200/90 marker:text-blue-500/50">
                                <li>más calma</li>
                                <li>más claridad mental</li>
                                <li>más conexión contigo</li>
                            </ul>
                        </div>
                        
                        <div className="space-y-6 bg-[#19325a]/30 p-8 md:p-10 rounded-3xl border border-blue-400/20 shadow-inner">
                            <p className="text-[#E6F0FF] font-medium italic text-xl">
                                Recuerda algo importante.<br/>
                            </p>
                            <p className="text-blue-200">
                                Esto ha sucedido en solo 7 días.
                            </p>
                            <p className="text-xl">
                                Imagina lo que podría cambiar si estas prácticas formaran parte de tu vida.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p>Por eso he creado <strong className="text-blue-300 font-normal">Calma Azul</strong>.</p>
                            <p>Una membresía donde seguimos explorando la Salud Azul a través de:</p>
                            <ul className="list-disc pl-6 space-y-3 text-blue-200/90 marker:text-blue-500/50">
                                <li>prácticas de movimiento y yoga somático</li>
                                <li>meditaciones y respiración</li>
                                <li>podcasts exclusivos</li>
                                <li>encuentros en vivo</li>
                                <li>clases de SUP yoga y talleres para la comunidad</li>
                            </ul>
                        </div>

                        <div className="text-center pt-16 border-t border-[#1a365d]/50 space-y-12">
                            <p className="text-xl tracking-wide opacity-90">
                                El Reset Azul es solo el principio.
                            </p>
                            <p className="text-[#E6F0FF] text-2xl md:text-3xl font-medium tracking-wide">
                                Si quieres seguir este camino, te veo dentro de Club Calma Azul.
                            </p>
                            
                            <a 
                                href="https://club-calma-azul-membres-a-premium-926838840634.us-west1.run.app/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-block mt-8 px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full transition-all duration-700 shadow-[0_15px_40px_-10px_rgba(59,130,246,0.4)] hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.6)] hover:-translate-y-1 backdrop-blur-md uppercase tracking-[0.2em] text-sm font-medium w-full sm:w-auto"
                            >
                                Entrar a Club Calma Azul
                            </a>
                        </div>
                    </div>

                </section>
            </main>
            <Footer />
        </div>
    );
}

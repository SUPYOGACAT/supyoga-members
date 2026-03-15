import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ReflectionForm from './ReflectionForm'
import NextDayButton from './NextDayButton'
import VideoPlayer from './VideoPlayer'
import CompanionIntro from './CompanionIntro'
import WaterDropsCounter from './WaterDropsCounter'
import MicroInsight from './MicroInsight'
import UserMenu from './UserMenu'
import { blueResetJourney, dayZeroModule } from '@/data/journey'
import Footer from '../components/Footer'

const JOURNEY_STAGES = [
    'Calmar', 'Restaurar', 'Regular', 'Liberar', 'Abrir', 'Coherencia', 'Integrar'
];

export default async function DashboardPage({
    searchParams
}: {
    searchParams: Promise<{ day?: string }>
}) {
    const params = await searchParams;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch the current user state
    const { data: userState } = await supabase
        .from('user_states')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Fetch reflections to see if we have an insight for today
    const { data: dayReflections } = await supabase
        .from('reflections')
        .select('sentiment_flag, day')
        .eq('user_id', user.id)

    const drops = userState?.water_drops || 0;
    const stage = userState?.current_stage || 'NotStarted';

    // Calculate maxUnlockedDay based on 'created_at' and Madrid timezone
    let maxUnlockedDay = 1;
    if (userState?.created_at) {
        // We calculate how many midnights have passed since registration in Europe/Madrid
        const createdDate = new Date(userState.created_at);
        const now = new Date();

        // Format dates to YYYY-MM-DD in Madrid timezone
        const fmtOptions = { timeZone: 'Europe/Madrid', year: 'numeric' as const, month: '2-digit' as const, day: '2-digit' as const };
        const createdParts = new Intl.DateTimeFormat('en-CA', fmtOptions).formatToParts(createdDate);
        const nowParts = new Intl.DateTimeFormat('en-CA', fmtOptions).formatToParts(now);

        const createdString = `${createdParts.find(p => p.type === 'year')?.value}-${createdParts.find(p => p.type === 'month')?.value}-${createdParts.find(p => p.type === 'day')?.value}`;
        const nowString = `${nowParts.find(p => p.type === 'year')?.value}-${nowParts.find(p => p.type === 'month')?.value}-${nowParts.find(p => p.type === 'day')?.value}`;

        const createdDateOnly = new Date(`${createdString}T00:00:00Z`);
        const nowDateOnly = new Date(`${nowString}T00:00:00Z`);

        const diffTime = Math.abs(nowDateOnly.getTime() - createdDateOnly.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        maxUnlockedDay = 1 + diffDays; // Day 0 registration -> unlocks up to Day 1. Next midnight -> unlocks Day 2.
    }

    // Logic to determine active day (progress)
    let activeDayNum = stage === 'NotStarted' ? 0 : 1;
    const isStageCompleted = stage.startsWith('CompletedDay') || stage === 'CompletedReset';

    if (stage === 'CompletedReset') {
        activeDayNum = 7;
    } else if (stage.startsWith('ActiveDay')) {
        activeDayNum = parseInt(stage.replace('ActiveDay', '')) || 1;
    } else if (stage.startsWith('CompletedDay')) {
        activeDayNum = parseInt(stage.replace('CompletedDay', '')) || 1;
    }

    // Logic to determine which day to view
    let viewDayNum = activeDayNum;
    if (params.day) {
        const requestedDay = parseInt(params.day);
        const maxAccessibleDay = stage === 'CompletedReset' ? 7 : Math.min(activeDayNum, maxUnlockedDay);
        if (!isNaN(requestedDay) && requestedDay >= 0 && requestedDay <= maxAccessibleDay) {
            viewDayNum = requestedDay;
        }
    }

    const isViewingPastDay = viewDayNum < activeDayNum || (viewDayNum === activeDayNum && isStageCompleted);

    const currentModule = viewDayNum === 0
        ? { ...dayZeroModule, day: 0, microAction: { id: '0', description: '' } }
        : (blueResetJourney.find(m => m.day === viewDayNum) || blueResetJourney[0]);
    const currentDayReflection = dayReflections?.find(r => r.day === viewDayNum);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1826] to-[#0d2136] text-slate-200 p-6 md:p-12 selection:bg-blue-900/30 font-normal">
            <header className="flex justify-between items-center mb-16 max-w-4xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-700">
                <Link href="/dashboard" className="text-sm font-normal text-blue-200 tracking-[0.3em] mix-blend-screen">RESET AZUL</Link>
                <div className="flex items-center gap-6 z-50">
                    <WaterDropsCounter total={drops} justEarned={isStageCompleted && viewDayNum === activeDayNum ? 1 : 0} />
                    <div className="w-[1px] h-4 bg-blue-500/20"></div>
                    <UserMenu userName={user.user_metadata?.name || undefined} />
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-16">

                {/* Journey Progress Indicator */}
                <div className="relative px-4 max-w-2xl mx-auto mb-16 text-center">
                    <p className="text-slate-200 text-lg md:text-xl font-normal tracking-wide mb-2">Tu Reset Azul</p>
                    <div className="flex justify-center gap-1.5 mb-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                            let isAccessible = (dayNum <= activeDayNum && dayNum <= maxUnlockedDay) || stage === 'CompletedReset';
                            let isPast = dayNum < activeDayNum || (stage === 'CompletedReset' && dayNum <= 7) || (isStageCompleted && dayNum === activeDayNum);
                            let isCurrent = dayNum === activeDayNum && stage !== 'CompletedReset' && !isStageCompleted;
                            
                            let boxClass = "w-6 h-6 rounded-sm transition-all duration-500 flex items-center justify-center text-[10px] sm:text-xs font-mono font-medium ";
                            
                            if (isPast) {
                                boxClass += "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)] text-white";
                            } else if (isCurrent) {
                                boxClass += "bg-blue-900/40 border-[1.5px] border-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)] text-blue-300";
                            } else {
                                boxClass += "bg-slate-800/40 border border-slate-700/50 text-slate-500";
                            }

                            const isActiveView = dayNum === viewDayNum;
                            const viewHighlight = isActiveView ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-[#0a1826] scale-110 shadow-lg' : '';

                            if (isAccessible) {
                                return (
                                    <Link 
                                        key={dayNum} 
                                        href={`/dashboard?day=${dayNum}`} 
                                        className={`block relative z-50 cursor-pointer animate-fade-in hover:scale-110 hover:shadow-[0_0_15px_rgba(147,197,253,0.8)] transition-all ${viewHighlight} rounded-sm`}
                                    >
                                        <div className={boxClass}>
                                            {dayNum}
                                        </div>
                                    </Link>
                                );
                            }
                            return (
                                <div key={dayNum} className="opacity-40 cursor-not-allowed">
                                    <div className={boxClass}>
                                        {dayNum}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {stage !== 'CompletedReset' && <p className="text-slate-400 text-sm tracking-widest uppercase">Día {Math.min(activeDayNum, 7)} de 7</p>}
                    {stage === 'CompletedReset' && <p className="text-blue-400 text-sm tracking-widest uppercase">Completado</p>}
                </div>

                <section className="bg-[#0b1a29]/40 backdrop-blur-xl p-8 md:p-16 rounded-[40px] border border-[#1a365d]/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-1000 max-w-4xl mx-auto">
                    <div className="absolute -top-64 -right-64 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

                    <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
                        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-slate-300 mb-8">Enfoque de Hoy</h2>
                        <h3 className="text-5xl md:text-7xl font-normal text-[#E6F0FF] mb-10 tracking-tighter opacity-95">Día {currentModule.day}: {currentModule.theme}</h3>

                        <p className="text-slate-200 leading-[1.6] text-lg md:text-xl font-normal max-w-2xl mx-auto">
                            {currentModule.description}
                        </p>
                    </div>

                    {/* Video Section */}
                    {currentModule.videoUrl && (
                        <div className="mb-20">
                            <VideoPlayer url={currentModule.videoUrl} />
                        </div>
                    )}

                    <div className="mt-16">
                        {!isViewingPastDay ? (
                                <div className="space-y-20 animate-fade-in max-w-3xl mx-auto">
                                    {/* Companion intro hidden for all days as per user requested pattern */}
                                    {false && <CompanionIntro day={viewDayNum} dayTheme={currentModule.theme} />}

                                    <div className="text-center space-y-10">
                                        {viewDayNum !== 0 && currentModule.practice && (
                                            <>
                                                <p className="text-slate-300 font-normal italic text-sm">Tómate un momento antes de continuar.</p>
                                                <div className="bg-[#0d2136]/60 rounded-3xl p-10 md:p-14 border border-[#1e3a5f]/40 backdrop-blur-md shadow-inner">
                                                    <p className="text-[#E6F0FF] text-xl md:text-2xl font-normal leading-[1.6] italic">{currentModule.practice}</p>
                                                </div>
                                            </>
                                        )}

                                        <ReflectionForm day={currentModule.day} practice={viewDayNum === 0 ? currentModule.practice : undefined} />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 px-8 bg-gradient-to-b from-blue-900/10 to-transparent rounded-[40px] border border-blue-500/10 text-center animate-fade-in relative overflow-hidden backdrop-blur-sm shadow-inner max-w-2xl mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent shimmer-effect"></div>
                                    <div className="text-5xl mb-8 opacity-80">🌊</div>
                                    <p className="text-[#E6F0FF] font-normal text-2xl md:text-3xl italic tracking-wide mb-4">El agua está en calma.</p>
                                    <p className="text-slate-200 font-normal text-lg md:text-xl tracking-wide">Has completado la práctica de este día.</p>

                                    <div className="inline-block mt-14 px-8 py-3 rounded-full border border-blue-500/20 bg-blue-900/30 backdrop-blur-md shadow-lg shadow-blue-900/20">
                                        <span className="text-blue-200/90 text-sm font-normal tracking-[0.2em] uppercase">
                                            Día {viewDayNum} Completado
                                        </span>
                                    </div>

                                    <div className="mt-12">
                                        <MicroInsight sentiment={currentDayReflection?.sentiment_flag as "calm" | "neutral" | "low_emotion"} day={viewDayNum} />
                                    </div>

                                    {viewDayNum === activeDayNum && isStageCompleted && activeDayNum < 7 && (
                                        <div className="mt-12">
                                            {activeDayNum + 1 <= maxUnlockedDay ? (
                                                <NextDayButton />
                                            ) : (
                                                <div className="inline-block px-8 py-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm max-w-sm mx-auto">
                                                    <p className="text-slate-300 text-sm italic font-light leading-relaxed">
                                                        Práctica guardada con éxito.<br/>
                                                        El Día {activeDayNum + 1} estará disponible a partir de medianoche.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Final transition button if Day 7 is completed */}
                                    {viewDayNum === 7 && isStageCompleted && (
                                        <div className="mt-12">
                                            <Link href="/membership" className="inline-block px-10 py-4 bg-blue-600/20 hover:bg-blue-600/30 text-[#E6F0FF] border border-blue-400/30 rounded-full transition-all duration-700 font-normal shadow-[0_15px_40px_-10px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] hover:-translate-y-1 backdrop-blur-md uppercase tracking-[0.2em] text-xs">
                                                Descubrir mi perfil final
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

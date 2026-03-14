import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ReflectionForm from './ReflectionForm'
import DaySevenResult from './DaySevenResult'
import NextDayButton from './NextDayButton'
import VideoPlayer from './VideoPlayer'
import CompanionIntro from './CompanionIntro'
import WaterDropsCounter from './WaterDropsCounter'
import MicroInsight from './MicroInsight'
import UserMenu from './UserMenu'
import { blueResetJourney, dayZeroModule } from '@/data/journey'
import { ResultEngine } from '@/lib/agents/result_engine'
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
        const maxAccessibleDay = stage === 'CompletedReset' ? 7 : activeDayNum;
        if (!isNaN(requestedDay) && requestedDay >= 0 && requestedDay <= maxAccessibleDay) {
            viewDayNum = requestedDay;
        }
    }

    const isViewingPastDay = viewDayNum < activeDayNum || (viewDayNum === activeDayNum && isStageCompleted);

    const currentModule = viewDayNum === 0
        ? { ...dayZeroModule, day: 0, microAction: { id: '0', description: '' } }
        : (blueResetJourney.find(m => m.day === viewDayNum) || blueResetJourney[0]);
    const currentDayReflection = dayReflections?.find(r => r.day === viewDayNum);

    let resultSummary = "";
    if (viewDayNum === 7 && isStageCompleted) {
        resultSummary = await ResultEngine.generateSummary(user.id);
    }

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
                <div className="relative px-4 max-w-2xl mx-auto mb-16">
                    {/* Path line background */}
                    <div className="absolute top-3 left-10 right-10 h-[1px] bg-blue-900/30 -z-10"></div>
                    {/* Active path line */}
                    <div
                        className="absolute top-3 left-10 h-[1px] bg-blue-400/30 -z-10 transition-all duration-1000"
                        style={{ width: `${Math.max(0, ((activeDayNum - 1) / 6) * 100)}%` }}
                    ></div>

                    <div className="flex justify-between items-center">
                        {JOURNEY_STAGES.map((stageName, index) => {
                            const dayIndex = index + 1;
                            const isPast = dayIndex < activeDayNum || (stage === 'CompletedReset' && dayIndex <= 7) || (isStageCompleted && dayIndex === activeDayNum);
                            const isCurrent = dayIndex === activeDayNum && stage !== 'CompletedReset' && !isStageCompleted;
                            const isAccessible = dayIndex <= activeDayNum || stage === 'CompletedReset';

                            const indicator = (isPast || (isCurrent && isStageCompleted)) ? '●' : isCurrent ? '●' : '○';

                            // Highlight dot if it's the active view, except if we are on day 0 (none will be highlighted)
                            const isActiveView = dayIndex === viewDayNum;

                            return (
                                <Link
                                    key={index}
                                    href={isAccessible ? `/dashboard?day=${dayIndex}` : '#'}
                                    className={`flex flex-col items-center gap-3 transition-all duration-700 ${isActiveView ? 'text-blue-300 scale-125' :
                                        isAccessible ? 'text-blue-500/60 hover:text-blue-400' : 'text-slate-700/50 cursor-not-allowed'
                                        }`}
                                >
                                    <span className={`text-md bg-[#050c14] px-1 drop-shadow-lg ${isActiveView ? 'drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]' : ''}`}>{indicator}</span>
                                    <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] font-normal">{stageName}</span>
                                </Link>
                            );
                        })}
                    </div>
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

                    {viewDayNum === 7 && isStageCompleted ? (
                        <DaySevenResult summary={resultSummary} />
                    ) : (
                        <div className="mt-16">
                            {!isViewingPastDay ? (
                                <div className="space-y-20 animate-fade-in max-w-3xl mx-auto">
                                    <CompanionIntro day={viewDayNum} dayTheme={currentModule.theme} />

                                    <div className="text-center space-y-10">
                                        <p className="text-slate-300 font-normal italic text-sm">Tómate un momento antes de continuar.</p>
                                        <div className="bg-[#0d2136]/60 rounded-3xl p-10 md:p-14 border border-[#1e3a5f]/40 backdrop-blur-md shadow-inner">
                                            <p className="text-[#E6F0FF] text-xl md:text-2xl font-normal leading-[1.6] italic">{currentModule.practice}</p>
                                        </div>

                                        <ReflectionForm day={currentModule.day} />
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

                                    {/* Only show next day button if viewing the actual current completed day */}
                                    {viewDayNum === activeDayNum && isStageCompleted && activeDayNum < 7 && (
                                        <div className="mt-12">
                                            <NextDayButton />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default function CompanionResponseCard({ response }: { response: string }) {
    return (
        <div className="mt-16 p-10 md:p-14 bg-[#19325a]/80 rounded-[40px] border border-blue-400/20 animate-fade-in relative overflow-hidden backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] transition-all duration-1000 max-w-2xl mx-auto">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="flex flex-col items-center gap-8 relative z-10 text-center">
                <div className="text-4xl opacity-90 mix-blend-screen drop-shadow-sm">🌊</div>
                <div>
                    <p className="text-[#E6F0FF] italic font-normal leading-[1.6] text-xl md:text-2xl tracking-wide px-4">
                        {response}
                    </p>
                </div>
            </div>
        </div>
    )
}

import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="w-full max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-700">
            <div className="h-[1px] w-12 bg-blue-500/20 mb-2"></div>
            <img
                src="https://supyoga.cat/wp-content/uploads/2018/08/LOGO-PETIT-184x30@2x.png"
                alt="SupYoga Barcelona"
                className="h-8 w-auto mix-blend-screen opacity-70"
            />
            <p className="text-slate-300/40 text-[10px] tracking-[0.3em] uppercase">
                Blue Reset by SupYoga Barcelona
            </p>
        </footer>
    )
}

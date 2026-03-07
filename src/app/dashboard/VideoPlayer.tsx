'use client'

export default function VideoPlayer({ url }: { url: string }) {
    // Basic YouTube embed conversion
    const getEmbedUrl = (videoUrl: string) => {
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            const videoId = videoUrl.includes('v=')
                ? videoUrl.split('v=')[1].split('&')[0]
                : videoUrl.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`;
        }
        return videoUrl;
    };

    const embedUrl = getEmbedUrl(url);

    return (
        <div className="w-full max-w-3xl mx-auto mb-16 aspect-video bg-[#050c14]/80 rounded-3xl border border-[#1a365d]/40 overflow-hidden relative shadow-2xl group">
            <div className="absolute inset-0 bg-blue-900/10 shimmer-effect opacity-50 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
            <iframe
                src={embedUrl}
                className="w-full h-full border-none relative z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}

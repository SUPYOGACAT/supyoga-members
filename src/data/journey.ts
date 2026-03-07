export interface DailyModule {
    day: number;
    theme: string;
    title: string;
    description: string;
    videoUrl: string; // Placeholder for now
    practice: string;
    microAction: {
        id: string;
        description: string;
    };
}

export const blueResetJourney: DailyModule[] = [
    {
        day: 1,
        theme: 'Pausa',
        title: 'El Arte de Parar',
        description: 'Antes de poder movernos, antes de poder respirar profundamente, debemos aprender a parar. Hoy simplemente consiste en observar el espacio entre las acciones.',
        videoUrl: 'https://www.youtube.com/watch?v=jNn3j7h_1NE',
        practice: 'Siéntate en silencio durante 2 minutos. No hagas nada más.',
        microAction: {
            id: 'action_001',
            description: 'Bebe un vaso de agua, prestando atención a la temperatura.'
        }
    },
    {
        day: 2,
        theme: 'Respira',
        title: 'Encontrando el Ancla',
        description: 'La respiración conecta la mente con el cuerpo. Encontrar un ritmo calmado y constante regula el sistema nervioso.',
        videoUrl: '/videos/day2-breathe.mp4',
        practice: 'Respiración en caja: inhala en 4s, sostén en 4s, exhala en 4s, sostén en 4s.',
        microAction: {
            id: 'action_002',
            description: 'Haz 3 respiraciones conscientes antes de tu próxima comida.'
        }
    },
    {
        day: 3,
        theme: 'Siente',
        title: 'Reconexión Sensorial',
        description: 'Observa las sensaciones físicas en tu cuerpo sin intentar cambiarlas.',
        videoUrl: '/videos/day3-feel.mp4',
        practice: 'Un escaneo corporal sencillo desde los dedos de los pies hasta la cabeza.',
        microAction: {
            id: 'action_003',
            description: 'Sostén un cubito de hielo o lávate las manos con agua muy fría.'
        }
    },
    {
        day: 4,
        theme: 'Muévete',
        title: 'Flujo Consciente',
        description: 'Introduce un movimiento suave y fluido inspirado en las propiedades del agua y el SUP Yoga.',
        videoUrl: '/videos/day4-move.mp4',
        practice: 'Flujo de movilidad espinal en el suelo.',
        microAction: {
            id: 'action_004',
            description: 'Estira los brazos por encima de la cabeza durante 30 segundos al despertarte.'
        }
    },
    {
        day: 5,
        theme: 'Suelta',
        title: 'Dejando Ir',
        description: 'La tensión a menudo se retiene físicamente. Hoy practicamos el acto físico de soltar nuestro agarre.',
        videoUrl: '/videos/day5-release.mp4',
        practice: 'Relajación muscular progresiva centrada en la mandíbula y los hombros.',
        microAction: {
            id: 'action_005',
            description: 'Suspira de forma audible tres veces al cambiar del trabajo al descanso.'
        }
    },
    {
        day: 6,
        theme: 'Integra',
        title: 'La Ola Diaria',
        description: 'Estas prácticas no son eventos aislados. Son herramientas para integrarlas en el ritmo de la vida cotidiana.',
        videoUrl: '/videos/day6-integrate.mp4',
        practice: 'Combina respiración y movimiento en un flujo continuo de 5 minutos.',
        microAction: {
            id: 'action_006',
            description: 'Vincula tu respiración profunda a un hábito diario (como preparar té/café).'
        }
    },
    {
        day: 7,
        theme: 'Vive en Azul',
        title: 'El Viaje Continua',
        description: 'Has completado el reseteo. Ahora, el agua permanece disponible para ti siempre.',
        videoUrl: '/videos/day7-liveblue.mp4',
        practice: 'Una práctica de tu elección. ¿Qué necesita tu cuerpo hoy?',
        microAction: {
            id: 'action_007',
            description: 'Comprométete a llevar adelante una micro-acción.'
        }
    }
];

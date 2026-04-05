export interface AudioOption {
    label: string;
    url: string;
}

export interface DailyModule {
    day: number;
    theme: string;
    title: string;
    description: string;
    videoUrl: string;
    practice: string;
    microAction: {
        id: string;
        description: string;
    };
    rewardMessage: string;
    audios?: AudioOption[];
}

// Day 0 is a special module shown before the main journey begins
export interface WelcomeModule {
    videoUrl: string;
    title: string;
    subtitle: string;
    description: string;
}

export interface DayZeroModule {
    videoUrl: string;
    theme: string;
    title: string;
    description: string;
    practice: string;
    audios?: AudioOption[];
}

export const welcomeModule: WelcomeModule = {
    videoUrl: 'https://www.youtube.com/watch?v=Ja21lyFZUhQ',
    title: 'Reset Azul',
    subtitle: 'Tu viaje de 7 días hacia la calma interior',
    description: 'Un reset completo del sistema nervioso a través de prácticas inspiradas en el entorno aquático. Calma, restaura y regula desde dentro.'
};

export const dayZeroModule: DayZeroModule = {
    videoUrl: 'https://www.youtube.com/watch?v=EsVnVF6PZuo',
    theme: 'Test Inicial + Intención',
    title: 'Antes de empezar vamos a hacer algo importante',
    description: 'Necesitamos saber cómo estás hoy. Por eso en este día 0 vas a hacer una pequeña evaluación inicial para observar tres aspectos de tu bienestar:\n\n• tu nivel de energía\n• tu calidad de sueño\n• tu nivel de estrés',
    practice: 'No hay respuestas correctas. Solo tu percepción en este momento. Este punto será tu referencia para observar qué cambia durante los próximos 7 días. Toma tu libreta y empieza con el Día 0.'
};

export const blueResetJourney: DailyModule[] = [
    {
        day: 1,
        theme: 'Calmar',
        title: 'El Arte de Parar',
        description: 'Hoy empezamos con algo esencial.\n\nTu sistema nervioso está constantemente recibiendo información del entorno: sonidos, luz, personas, situaciones… Y muchas veces acumula más tensión de la que somos conscientes.\n\nEn la práctica de hoy vamos a usar la respiración para enviar una señal de calma al cuerpo. Es una práctica sencilla que puedes hacer frente al mar o desde casa observando un horizonte amplio. Solo necesitas unos minutos para empezar a crear más espacio dentro de ti.\n\nCuando estés listo, empieza la práctica.',
        videoUrl: 'https://www.youtube.com/watch?v=ZP8m1uxZUpg',
        practice: '',
        microAction: {
            id: 'action_001',
            description: 'Antes de tu próxima comida, haz 3 ciclos de respiración 4-2-6 con los ojos cerrados.'
        },
        rewardMessage: '🌊 Primer paso completado.\nHoy has enviado una señal de calma a tu sistema nervioso.\nA veces solo necesitamos unos minutos para empezar a cambiar nuestro estado interno.',
        audios: [
            { label: 'Solo audio', url: 'https://supyoga.cat/wp-content/uploads/2026/03/DIA-1.mp3' }
        ]
    },
    {
        day: 2,
        theme: 'Restaurar',
        title: 'Caminata Sensorial',
        description: 'Hoy vamos a despertar el cuerpo a través del movimiento.\n\nLa práctica de hoy es una caminata sensorial. No se trata de caminar rápido ni de hacer ejercicio. Se trata de caminar prestando atención.\n\n• A la textura del suelo.\n• Al movimiento del cuerpo.\n• A la respiración.\n\nPuedes hacerlo en la playa, en la naturaleza o incluso en la ciudad. Lo importante no es el lugar. Es la presencia con la que caminas.\n\nEmpieza la caminata y observa cómo responde tu cuerpo.',
        videoUrl: 'https://www.youtube.com/watch?v=ZUEQyDO5Pbg',
        practice: '',
        microAction: {
            id: 'action_002',
            description: 'Frota despacio las manos y pásalas por las mejillas, las orejas y la cabeza. Tómate 60 segundos de autocontacto consciente.'
        },
        rewardMessage: '🌊 Tu cuerpo empieza a despertar.\nCuando caminas con presencia, tu mente empieza a desacelerar y tu sistema nervioso se siente más seguro.',
        audios: [
            { label: 'Audio voz + sonido de entorno', url: 'https://supyoga.cat/wp-content/uploads/2026/03/DIA-2-Audio-con-sonido-entorno-voz.mp3' },
            { label: 'Solo audio voz', url: 'https://supyoga.cat/wp-content/uploads/2026/03/DIA-2-Audio-solo-voz.mp3' }
        ]
    },
    {
        day: 3,
        theme: 'Regular',
        title: 'El Ritmo del Mar',
        description: 'El sonido del mar tiene un efecto muy especial sobre nuestra mente.\n\nSu ritmo repetitivo ayuda al cerebro a entrar en estados de calma y concentración. Hoy vas a sincronizar tu respiración con ese ritmo.\n\nSi tienes el mar cerca, simplemente escúchalo. Si no, puedes usar el audio que acompaña esta práctica.\n\nNo hay que hacer nada perfecto. Solo observar la respiración y dejar que poco a poco encuentre su propio ritmo.',
        videoUrl: 'https://www.youtube.com/watch?v=8TBRFDPXUM8',
        practice: '',
        microAction: {
            id: 'action_003',
            description: 'Pon 3 minutos de sonido del mar en el móvil y simplemente escúchalo. Sin hacer nada más.'
        },
        rewardMessage: '🌊 Tu respiración encuentra un nuevo ritmo.\nEl cuerpo sabe volver a la calma cuando le damos el espacio para hacerlo.',
        audios: [
            { label: 'Audio voz + mar', url: 'https://supyoga.cat/wp-content/uploads/2026/03/DIA-3-Audio-con-sonido-mar-voz.mp3' },
            { label: 'Solo audio voz', url: 'https://supyoga.cat/wp-content/uploads/2026/03/DIA-3-Audio-solo-voz.mp3' }
        ]
    },
    {
        day: 4,
        theme: 'Liberar',
        title: 'Sacudir y Soltar',
        description: 'A lo largo del día el cuerpo acumula tensión sin que nos demos cuenta.\n\n• En los hombros.\n• En la mandíbula.\n• En el cuello.\n\nHoy vamos a hacer una práctica muy sencilla para liberar esa tensión y ayudar al sistema nervioso a volver a un estado de seguridad. Es una práctica rápida que puedes usar en cualquier momento del día cuando necesites resetear el cuerpo.\n\nBusca un espacio donde puedas moverte con comodidad y empieza.',
        videoUrl: 'https://www.youtube.com/watch?v=hWouHnlqk8g',
        practice: '',
        microAction: {
            id: 'action_004',
            description: 'Cada vez que sientas tensión en los hombros hoy, haz 3 círculos hacia atrás y un suspiro audible.'
        },
        rewardMessage: '🌊 Has liberado carga acumulada.\nEl cuerpo guarda mucho más de lo que creemos.\nHoy le has dado permiso para soltar.'
    },
    {
        day: 5,
        theme: 'Abrir el Corazón',
        title: 'La Mano en el Pecho',
        description: 'Hoy vamos a conectar con una emoción que tiene un efecto profundo sobre nuestro bienestar: la gratitud.\n\nCuando sentimos gratitud, el cuerpo cambia. La respiración se suaviza. El sistema nervioso se regula. La mente se calma.\n\nEn esta práctica vas a usar la respiración y la atención en el corazón para despertar esa sensación. No necesitas buscar nada especial. Solo recordar algo que te haya sostenido esta semana.',
        videoUrl: 'https://www.youtube.com/watch?v=fB2ZwJ4Y5Ec',
        practice: '',
        microAction: {
            id: 'action_005',
            description: 'Escribe una sola frase de gratitud en tu libreta o en el móvil. Sin elaborar. Lo primero que salga.'
        },
        rewardMessage: '🌊 Tu corazón se abre un poco más.\nLa gratitud cambia la forma en que percibimos lo que nos sucede.'
    },
    {
        day: 6,
        theme: 'Coherencia',
        title: 'El Mar Dentro de Ti',
        description: 'Hoy vamos a hacer una meditación muy especial. Imaginaremos la respiración moviéndose como una ola dentro del cuerpo.\n\nA través de esta práctica vas a despertar la interocepción, la capacidad de percibir lo que sucede dentro de ti. Y poco a poco podrás sentir el ritmo de tu propio corazón.\n\nEs una práctica muy potente que podrás usar siempre que necesites volver a la calma.',
        videoUrl: 'https://www.youtube.com/watch?v=z7NdLy39YkI',
        practice: '',
        microAction: {
            id: 'action_006',
            description: 'En cualquier momento de tensión hoy, cierra los ojos 30 segundos e imagina una ola entrando y saliendo con tu respiración.'
        },
        rewardMessage: '🌊 La calma empieza a venir desde dentro.\nHoy has conectado con algo muy profundo: la capacidad de escucharte.'
    },
    {
        day: 7,
        theme: 'Integrar y Cerrar',
        title: 'El Viaje Continúa',
        description: 'Hemos llegado al último día del Reset Azul. Hoy es un día para integrar lo que has vivido durante esta semana.\n\nVas a repetir algunas de las respiraciones que has aprendido y después volverás a tu libreta para observar qué ha cambiado.\n\nNo se trata de que todo haya mejorado. Se trata de observar tu experiencia después de estos siete días. Al final de la práctica elegirás un pequeño micro-hábito que puedas llevar contigo en tu día a día.\n\nPorque los cambios reales no vienen de hacer mucho. Vienen de pequeños gestos repetidos en el tiempo.',
        videoUrl: 'https://www.youtube.com/watch?v=7S7yUnjNcD0',
        practice: '',
        microAction: {
            id: 'action_007',
            description: 'Comprométete con un único micro-hábito de los que has practicado esta semana. Escríbelo y ponlo en algún lugar visible.'
        },
        rewardMessage: '🌊 Reset Azul completado.\nDurante estos días has dedicado tiempo a parar, respirar y observar.\nPuede parecer pequeño…\npero los cambios reales empiezan exactamente así.'
    }
];

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
        description: 'Hoy comienzas el reset con la práctica más importante: parar. A través de la respiración 4-2-6 y el sonido del agua, le dices al sistema nervioso que puede soltar la guardia. La calma no es pasividad, es la base desde donde todo lo demás es posible.',
        videoUrl: 'https://www.youtube.com/watch?v=jNn3j7h_1NE',
        practice: 'Respiración 4-2-6: inhala 4 segundos, retén 2, exhala 6. Repite durante 5 minutos con los ojos cerrados o mirando el horizonte.',
        microAction: {
            id: 'action_001',
            description: 'Antes de tu próxima comida, haz 3 ciclos de respiración 4-2-6 con los ojos cerrados.'
        }
    },
    {
        day: 2,
        theme: 'Restaurar',
        title: 'Caminata Sensorial',
        description: 'Hoy restauras tu mente a través de los sentidos. Una caminata consciente activa la percepción del cuerpo desde los pies hasta los hombros, llevandte de la mente al cuerpo. Si puedes, camina descalza sobre arena o tierra. Si no, cualquier entorno sirve.',
        videoUrl: 'https://www.youtube.com/watch?v=ZUEQyDO5Pbg',
        practice: 'Sal a caminar lentamente 10-15 minutos. Presta atención completa a la textura bajo tus pies, el balanceo de tu cadera, el movimiento de tus brazos. Sin auriculares. Solo presencia.',
        microAction: {
            id: 'action_002',
            description: 'Frota despacio las manos y pásalas por las mejillas, las orejas y la cabeza. Tómate 60 segundos de autocontacto consciente.'
        }
    },
    {
        day: 3,
        theme: 'Regular',
        title: 'El Ritmo del Mar',
        description: 'Hoy usas el sonido del mar como guía para regular tu ritmo cardíaco. Con una respiración simétrica de 5-5 (inhala 5, exhala 5), o siguiendo el vaivén de las olas, entras en coherencia cardíaca: el estado en que corazón y sistema nervioso se sincronizan de forma natural.',
        videoUrl: 'https://www.youtube.com/watch?v=WPYKuGXO4rA',
        practice: 'Siéntate con los ojos cerrados o mirando el horizonte. Inhala 5 segundos, exhala 5 segundos. Deja que los pensamientos pasen como nubes. Mantén la práctica durante 5-10 minutos.',
        microAction: {
            id: 'action_003',
            description: 'Pon 3 minutos de sonido del mar en el móvil y simplemente escúchalo. Sin hacer nada más.'
        }
    },
    {
        day: 4,
        theme: 'Liberar',
        title: 'Sacudir y Soltar',
        description: 'La tensión acumulada suele vivir en el cuerpo, no en la mente. Hoy la liberamos con movimiento: sacudidas desde las manos, círculos de hombros, aperturas de brazos y un reset físico completo. El cuerpo sabe cómo soltar cuando le das permiso.',
        videoUrl: 'https://www.youtube.com/watch?v=hWouHnlqk8g',
        practice: 'Ponte de pie. Durante 5 minutos: sacude manos y brazos con energía, haz círculos de hombros, abre y cierra los brazos como olas. Termina frotando las manos y pasándolas por tu cuerpo desde la cabeza hasta los pies.',
        microAction: {
            id: 'action_004',
            description: 'Cada vez que sientas tensión en los hombros hoy, haz 3 círculos hacia atrás y un suspiro audible.'
        }
    },
    {
        day: 5,
        theme: 'Abrir el Corazón',
        title: 'La Mano en el Pecho',
        description: 'Hoy practicamos la gratitud como herramienta de regulación del sistema nervioso. Una mano sobre el corazón, una respiración 4-6, y un gesto de agradecimiento hacia algo que te haya sostenido esta semana. Simple, breve, y profundamente transformador.',
        videoUrl: 'https://www.youtube.com/watch?v=fB2ZwJ4Y5Ec',
        practice: 'Coloca tu mano derecha sobre el pecho. Inhala 4 segundos, exhala 6. Piensa en una sola cosa que te haya sostenido esta semana. Siéntela. Sonríe internamente. Inhala profundo y exhala soltando todo el aire.',
        microAction: {
            id: 'action_005',
            description: 'Escribe una sola frase de gratitud en tu libreta o en el móvil. Sin elaborar. Lo primero que salga.'
        }
    },
    {
        day: 6,
        theme: 'Coherencia',
        title: 'El Mar Dentro de Ti',
        description: 'Hoy llegamos a una de las meditaciones más potentes del reset: "El mar dentro de ti". Imaginas tu respiración moviéndose como una ola, y al final despiertas la sensación física de tu propio corazón desde dentro, a través de la interocepción. Una práctica para llevar siempre contigo.',
        videoUrl: 'https://www.youtube.com/watch?v=z7NdLy39YkI',
        practice: 'Siéntate en silencio y sigue la meditación guiada. Imagina que tu inhalación es una ola que llega a la orilla y tu exhalación es el mar retirándose. Al final, lleva la atención al latido de tu corazón, sin buscarlo con prisa, solo esperando sentirlo.',
        microAction: {
            id: 'action_006',
            description: 'En cualquier momento de tensión hoy, cierra los ojos 30 segundos e imagina una ola entrando y saliendo con tu respiración.'
        }
    },
    {
        day: 7,
        theme: 'Integrar y Cerrar',
        title: 'El Viaje Continúa',
        description: 'Has llegado al último día del Reset Azul. Hoy integras todo lo que has vivido. Vuelves a la respiración del Día 1, rescribes cómo te sientes ahora frente a cómo empezaste, y eliges un micro-hábito de 5 minutos para llevar contigo. El reset no termina hoy: comienza a vivir en ti.',
        videoUrl: 'https://www.youtube.com/watch?v=7S7yUnjNcD0',
        practice: 'Haz la respiración 4-2-6 durante 5 minutos. Luego escribe: ¿Cómo estaba? ¿Cómo estoy ahora? ¿Qué he descubierto de mí? Por último, elige un micro-hábito de esta semana para seguir practicando.',
        microAction: {
            id: 'action_007',
            description: 'Comprométete con un único micro-hábito de los que has practicado esta semana. Escríbelo y ponlo en algún lugar visible.'
        }
    }
];

export type Report = {
    id: string
    date: string
    label: string
    audioSrc: string
    transcript: string
    listened: boolean
} 


export const mockReports: Report[] = [
    {
        id: "rep-2026-05-04",
        date: "2026-05-04",
        label: "Lunes 4 de mayo",
        audioSrc: "/lunes.mp3",
        transcript: "Buenos días. Son las ocho de la mañana del lunes, cuatro de mayo de dos mil veintiséis. Este es tu reporte financiero diario de SAFA. Empezamos la semana con buenas noticias para tu cartera. Tu patrimonio total asciende a cuarenta y un mil ochocientos euros, un incremento del cero punto ocho por ciento respecto al cierre del viernes. De este total, veintisiete mil quinientos corresponden a inversiones activas y catorce mil trescientos a liquidez disponible. En el mercado cripto, Bitcoin abre la semana en noventa y un mil dólares, con una subida del uno punto dos por ciento desde el cierre del fin de semana. El volumen de trading es moderado, típico de apertura de semana. El sentimiento en noticias es positivo: destacan varios artículos sobre la aprobación de nuevos ETFs de Bitcoin en mercados asiáticos. Tu posición acumula una plusvalía no realizada de dos mil novecientos euros. El S&P quinientos cerró el viernes en cinco mil setecientos veinte puntos. Los futuros de hoy apuntan a una apertura plana, sin grandes catalizadores previstos para la jornada. El sentimiento en prensa económica es neutral, a la espera de los datos macro que se publicarán a mitad de semana. En el plano personal, comienzas mayo con un gasto acumulado de trescientos veinte euros, principalmente en alimentación y transporte. Ritmo saludable para el inicio de mes. Para hoy, SAFA te recomienda tres puntos de atención. Primero: apertura de semana tranquila, buen momento para revisar tu estrategia sin presión de mercado. Segundo: estate atento a los datos de inflación de la eurozona que se publican el miércoles, pueden mover el mercado. Tercero: no se detecta ninguna anomalía ni alerta en tu cartera. Esto ha sido tu resumen financiero del día. Que tengas un excelente lunes. Hasta mañana.",
        listened: true,
    },
    {
        id: "rep-2026-05-05",
        date: "2026-05-05",
        label: "Martes 5 de mayo",
        audioSrc: "/martes.mp3",
        transcript: "Buenos días. Son las ocho de la mañana del martes, cinco de mayo de dos mil veintiséis. Este es tu reporte financiero diario de SAFA. Tu patrimonio total se sitúa hoy en cuarenta y un mil cuatrocientos euros, una ligera corrección del uno por ciento respecto a ayer. La caída es moderada y está en línea con el comportamiento general del mercado. En el mercado cripto, Bitcoin ha retrocedido a ochenta y nueve mil quinientos dólares, una caída del uno punto siete por ciento en las últimas veinticuatro horas. El sentimiento en noticias ha virado a neutral-negativo: varios medios recogen declaraciones de un senador estadounidense que propone nuevas restricciones a los exchanges descentralizados. La caída parece de corto plazo, sin señales de cambio de tendencia estructural. Tu plusvalía no realizada se reduce a dos mil cuatrocientos euros. El S&P quinientos abrió en terreno negativo y cerró en cinco mil seiscientos ochenta puntos, una caída del cero punto siete por ciento. El sector tecnológico fue el más afectado. En el plano personal, tus gastos de mayo acumulan ya seiscientos ochenta euros. Se detecta un gasto en restaurantes un veinticinco por ciento superior a tu media habitual para esta fecha del mes. Para hoy, SAFA te recomienda tres puntos de atención. Primero: la caída de Bitcoin es moderada y no justifica ninguna acción por ahora. Segundo: vigila el dato de inflación de la eurozona de mañana, podría presionar aún más la renta variable. Tercero: modera el gasto en ocio si quieres cerrar el mes dentro de presupuesto. Esto ha sido tu resumen financiero del día. Que tengas un excelente martes. Hasta mañana.",
        listened: true,
    },
    {
        id: "rep-2026-05-06",
        date: "2026-05-06",
        label: "Miércoles 6 de mayo",
        audioSrc: "/miercoles.mp3",
        transcript: "Buenos días. Son las ocho de la mañana del miércoles, seis de mayo de dos mil veintiséis. Este es tu reporte financiero diario de SAFA. Hoy es la jornada clave de la semana: se publican los datos de inflación de la eurozona. Tu patrimonio total se mantiene en cuarenta y un mil trescientos euros, prácticamente sin cambios respecto a ayer. En el mercado cripto, Bitcoin consolida en torno a ochenta y nueve mil dólares, con un movimiento lateral en las últimas doce horas. El sentimiento en noticias es neutral, a la espera de los datos macro de esta tarde. Los traders de derivados muestran posiciones equilibradas, sin apuestas claras en ninguna dirección. El S&P quinientos abrió plano y se mantiene cerca de los cinco mil seiscientos ochenta puntos. Los datos de inflación publicados esta mañana en Europa muestran una moderación hasta el dos punto uno por ciento, ligeramente por debajo de lo esperado. El mercado reaccionó positivamente: los bonos europeos suben y el euro se aprecia frente al dólar. En el plano personal, llevas gastados novecientos diez euros en lo que va de mes. El ritmo es algo elevado, aunque todavía dentro de márgenes aceptables. Para hoy, SAFA te recomienda tres puntos de atención. Primero: la inflación moderada es una buena noticia para los activos de riesgo a medio plazo. Segundo: considera aprovechar la estabilidad actual de Bitcoin para revisar el peso de cripto en tu cartera. Tercero: ajusta el ritmo de gasto en la segunda quincena para compensar el inicio de mes. Esto ha sido tu resumen financiero del día. Que tengas un excelente miércoles. Hasta mañana.",
        listened: true,
    },
    {
        id: "rep-2026-05-07",
        date: "2026-05-07",
        label: "Jueves 7 de mayo",
        audioSrc: "/jueves.mp3",
        transcript: "Buenos días. Son las ocho de la mañana del jueves, siete de mayo de dos mil veintiséis. Este es tu reporte financiero diario de SAFA. La jornada de ayer dejó un balance positivo que se refleja hoy en tu cartera. Tu patrimonio total asciende a cuarenta y dos mil cien euros, un incremento del uno punto nueve por ciento respecto al miércoles. Es el mejor día de la semana hasta ahora. En el mercado cripto, Bitcoin ha repuntado con fuerza hasta los noventa y dos mil dólares, una subida del dos punto八 por ciento en veinticuatro horas. El detonante fue la reacción positiva a los datos de inflación europea de ayer. El sentimiento en noticias es claramente positivo: varios fondos institucionales han anunciado incrementos en sus posiciones de Bitcoin. Tu plusvalía no realizada en cripto alcanza los tres mil quinientos euros. El S&P quinientos subió un uno punto dos por ciento hasta los cinco mil setecientos cuarenta y ocho puntos. Los sectores financiero e industrial lideraron las subidas. El sentimiento macro es el mejor de la semana. En el plano personal, el gasto acumulado de mayo es de mil cien euros. Sigues por encima de tu media, pero la evolución del patrimonio compensa con creces. Para hoy, SAFA te recomienda tres puntos de atención. Primero: el momentum es positivo, pero no tomes decisiones de inversión impulsivas basadas en un solo día de subidas. Segundo: buen momento para revisar si quieres fijar algunas plusvalías parciales en cripto. Tercero: cierra la semana con cautela en el gasto. Esto ha sido tu resumen financiero del día. Que tengas un excelente jueves. Hasta mañana.",
        listened: true,
    },
    {
        id: "rep-2026-05-08",
        date: "2026-05-08",
        label: "Viernes 8 de mayo",
        audioSrc: "/viernes.mp3",
        transcript: "Buenos días. Son las ocho de la mañana del viernes, ocho de mayo de dos mil veintiséis. Este es tu reporte financiero diario de SAFA. Cerramos la semana con un balance muy positivo. Tu patrimonio total se sitúa en cuarenta y dos mil trescientos euros, un incremento acumulado del uno punto dos por ciento respecto al lunes. Ha sido una buena semana. En el mercado cripto, Bitcoin mantiene los noventa y dos mil dólares con baja volatilidad, señal de consolidación saludable tras las subidas del jueves. El sentimiento en noticias es positivo-neutral: el mercado digiere las subidas sin euforia excesiva. Tu plusvalía no realizada en cripto se mantiene en tres mil seiscientos euros. El S&P quinientos avanza ligeramente hasta los cinco mil setecientos sesenta puntos, completando su mejor semana en lo que va de mayo. El cierre semanal es sólido. En el plano personal, cierras la semana con un gasto total de mil doscientos cincuenta euros. Está por encima de tu media semanal habitual, principalmente por el gasto en restaurantes detectado a principios de semana. Para el fin de semana, SAFA te recomienda tres puntos de atención. Primero: semana excelente en términos de patrimonio, tómate el fin de semana sin revisar los mercados. Segundo: plantéate un presupuesto más estricto para la semana que viene. Tercero: el próximo lunes se publican datos de empleo en Estados Unidos, pueden generar volatilidad. Esto ha sido tu resumen financiero de la semana. Que tengas un excelente fin de semana. Hasta el lunes.",
        listened: true,
    },
    {
        id: "rep-2026-05-11",
        date: "2026-05-11",
        label: "Lunes 11 de mayo",
        audioSrc: "/reporte.mp3",
        transcript: "Buenos días. Son las siete de la mañana del lunes, once de mayo de dos mil veintiséis. Este es tu reporte financiero diario de SAFA. Empezamos la semana con el mercado pendiente de los datos de empleo publicados el viernes en Estados Unidos. Tu patrimonio total asciende a cuarenta y dos mil ochocientos euros, un incremento del uno punto deux por ciento respecto al cierre del viernes. Buena apertura de semana. En el mercado cripto, Bitcoin abre en noventa y tres mil dólares, con una subida del uno por ciento desde el cierre del fin de semana. El dato de empleo americano fue mejor de lo esperado, lo que ha impulsado el apetito por activos de riesgo. El sentimiento en noticias es positivo: destacan análisis que apuntan a un posible nuevo máximo histórico de Bitcoin en las próximas semanas. Tu plusvalía no realizada alcanza los tres mil ochocientos euros, nuevo máximo de la semana. El S&P quinientos cerró el viernes en cinco mil setecientos ochenta puntos y los futuros apuntan a una apertura alcista hoy. El entorno macro es favorable. En el plano personal, comienzas la segunda semana de mayo con un gasto acumulado de mil doscientos cincuenta euros. Si mantienes el ritmo actual, cerrarás el mes dentro de tu presupuesto objetivo. Para hoy, SAFA te recomienda tres puntos de atención. Primero: apertura de semana con momentum positivo, buen contexto para revisar tu estrategia de medio plazo. Segundo: vigila posibles declaraciones de la Reserva Federal a mitad de semana, pueden generar volatilidad. Tercero: tu cartera está en su mejor momento del mes, no hay ninguna alerta activa. Esto ha sido tu resumen financiero del día. Que tengas un excelente lunes. Hasta mañana.",
        listened: false,
    },
]

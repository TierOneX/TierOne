import { Link } from '@inertiajs/react';

const tournaments = [
    {
        id: 1,
        game: 'League of Legends',
        name: 'TierOne Champions Cup',
        date: '22 FEB 2026',
        time: '18:00 CET',
        prize: '5.000€',
        slots: { total: 32, filled: 28 },
        status: 'INSCRIPCIONES ABIERTAS',
        statusColor: '#00c853',
        gameColor: '#C89B3C',
        gameIcon: '⚔️',
    },
    {
        id: 2,
        game: 'Valorant',
        name: 'Ranked Showdown #12',
        date: '25 FEB 2026',
        time: '20:00 CET',
        prize: '2.500€',
        slots: { total: 16, filled: 12 },
        status: 'INSCRIPCIONES ABIERTAS',
        statusColor: '#00c853',
        gameColor: '#FF4655',
        gameIcon: '🎯',
    },
    {
        id: 3,
        game: 'Counter-Strike 2',
        name: 'CS2 Weekly Battle',
        date: '01 MAR 2026',
        time: '19:00 CET',
        prize: '1.000€',
        slots: { total: 16, filled: 16 },
        status: 'COMPLETO',
        statusColor: '#e31837',
        gameColor: '#F0B232',
        gameIcon: '💣',
    },
    {
        id: 4,
        game: 'Fortnite',
        name: 'Build & Destroy Open',
        date: '05 MAR 2026',
        time: '17:00 CET',
        prize: '1.500€',
        slots: { total: 64, filled: 31 },
        status: 'PRÓXIMAMENTE',
        statusColor: '#4040ff',
        gameColor: '#00D4FF',
        gameIcon: '🏗️',
    },
];

export default function TournamentsSection() {
    return (
        <section id="tournaments-section" className="py-12 lg:py-20" style={{ background: '#0d0d0f' }}>
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <p className="text-[#e31837] text-xs font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                            <span className="w-5 h-[2px] bg-[#e31837] rounded-full" />
                            COMPETICIÓN
                        </p>
                        <h2 className="text-2xl lg:text-4xl font-black italic uppercase text-white">
                            TORNEOS <span className="text-[#e31837]">PRÓXIMOS</span>
                        </h2>
                    </div>
                    <Link
                        href="/tournaments"
                        className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[#e31837] transition-colors duration-200 flex items-center gap-2 group"
                    >
                        Ver todos
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Lista de torneos */}
                <div className="space-y-4">
                    {tournaments.map((t) => {
                        const slotsPercent = (t.slots.filled / t.slots.total) * 100;
                        const isFull = t.slots.filled >= t.slots.total;

                        return (
                            <Link
                                key={t.id}
                                href={`/tournaments/${t.id}`}
                                id={`tournament-${t.id}`}
                                className="group block rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden"
                                style={{ background: '#16161a' }}
                            >
                                <div className="flex flex-col lg:flex-row items-stretch">
                                    {/* Barra de color lateral (solo desktop) */}
                                    <div className="hidden lg:block w-1.5 flex-shrink-0 transition-all duration-300 group-hover:w-2" style={{ background: t.gameColor }} />

                                    {/* Contenido principal */}
                                    <div className="flex-1 p-5 lg:p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                                            {/* Juego + Nombre */}
                                            <div className="flex items-center gap-4 lg:w-[340px]">
                                                {/* Icono del juego */}
                                                <div
                                                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl lg:text-3xl transition-transform duration-300 group-hover:scale-105"
                                                    style={{ background: `${t.gameColor}15`, border: `1px solid ${t.gameColor}25` }}
                                                >
                                                    {t.gameIcon}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: t.gameColor }}>
                                                        {t.game}
                                                    </p>
                                                    <h3 className="text-white font-bold text-base lg:text-lg truncate group-hover:text-gray-200 transition-colors">
                                                        {t.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Fecha */}
                                            <div className="flex items-center gap-6 lg:gap-8 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-400 font-medium">{t.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-gray-400 font-medium">{t.time}</span>
                                                </div>
                                            </div>

                                            {/* Premio */}
                                            <div className="lg:text-center lg:w-[100px]">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">Premio</p>
                                                <p className="text-white font-black text-lg lg:text-xl">{t.prize}</p>
                                            </div>

                                            {/* Plazas */}
                                            <div className="lg:w-[160px]">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {t.slots.filled}/{t.slots.total} equipos
                                                    </span>
                                                    <span
                                                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                                                        style={{
                                                            color: t.statusColor,
                                                            background: `${t.statusColor}15`,
                                                        }}
                                                    >
                                                        {t.status}
                                                    </span>
                                                </div>
                                                {/* Barra de progreso */}
                                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${slotsPercent}%`,
                                                            background: isFull
                                                                ? '#e31837'
                                                                : `linear-gradient(90deg, ${t.gameColor}, ${t.gameColor}cc)`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Botón */}
                                            <div className="lg:ml-auto flex-shrink-0">
                                                <span
                                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${isFull
                                                            ? 'bg-white/5 text-gray-500 border border-white/10'
                                                            : 'bg-[#e31837] text-white hover:bg-[#c2102d] hover:shadow-lg hover:shadow-red-900/20 active:scale-95'
                                                        }`}
                                                >
                                                    {isFull ? 'COMPLETO' : 'INSCRIBIRSE'}
                                                    {!isFull && (
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

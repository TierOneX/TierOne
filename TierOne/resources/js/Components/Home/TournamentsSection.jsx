import { Link } from '@inertiajs/react';

/**
 * Props esperadas: tournaments = [{
 *   id, name, game, game_image, date, time, prize,
 *   slots_total, slots_filled, status, status_color
 * }]
 * game_image: ruta de la imagen del juego del torneo
 */
export default function TournamentsSection({ tournaments }) {
    if (!tournaments || tournaments.length === 0) return null;

    return (
        <section id="tournaments-section" className="py-14 lg:py-20" style={{ background: '#0a0a0c' }}>
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
                    <Link href="/tournaments"
                        className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[#e31837] transition-colors flex items-center gap-2 group">
                        Ver todos
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Lista de torneos */}
                <div className="space-y-4">
                    {tournaments.map((t) => {
                        const slotsPercent = (t.slots_filled / t.slots_total) * 100;
                        const isFull = t.slots_filled >= t.slots_total;

                        return (
                            <Link
                                key={t.id}
                                href={`/tournaments/${t.id}`}
                                className="group block rounded-xl border border-white/5 hover:border-[#e31837]/30 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-red-900/5"
                                style={{ background: '#141418' }}
                            >
                                <div className="flex flex-col lg:flex-row items-stretch">
                                    {/* Imagen del juego */}
                                    <div className="relative lg:w-[200px] h-[120px] lg:h-auto flex-shrink-0 overflow-hidden">
                                        <img
                                            src={t.game_image}
                                            alt={t.game}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#141418] hidden lg:block" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#141418] lg:hidden" />
                                        <span className="absolute bottom-3 left-4 lg:bottom-4 text-xs font-black uppercase tracking-wider text-white drop-shadow-lg">
                                            {t.game}
                                        </span>
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 p-5 lg:p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                                            {/* Nombre */}
                                            <div className="lg:w-[240px] min-w-0">
                                                <h3 className="text-white font-bold text-lg lg:text-xl truncate group-hover:text-gray-200 transition-colors">
                                                    {t.name}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm">
                                                    <span className="flex items-center gap-1.5 text-gray-500">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {t.date}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-gray-500">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {t.time}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Premio */}
                                            <div className="lg:text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">Premio</p>
                                                <p className="text-[#e31837] font-black text-2xl">{t.prize}</p>
                                            </div>

                                            {/* Plazas */}
                                            <div className="lg:w-[180px]">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs text-gray-500">{t.slots_filled}/{t.slots_total} equipos</span>
                                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                                                        style={{ color: t.status_color || '#00c853', background: `${t.status_color || '#00c853'}15` }}>
                                                        {t.status}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                                                    <div className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${slotsPercent}%`,
                                                            background: isFull ? '#e31837' : 'linear-gradient(90deg, #e31837, #ff4444)',
                                                        }} />
                                                </div>
                                            </div>

                                            {/* Botón */}
                                            <div className="lg:ml-auto flex-shrink-0">
                                                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${isFull
                                                        ? 'bg-white/5 text-gray-500 border border-white/10'
                                                        : 'bg-[#e31837] text-white hover:bg-[#c2102d] hover:shadow-lg hover:shadow-red-900/30 active:scale-95'
                                                    }`}>
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

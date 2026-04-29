const imgUrl = (src) => {
    if (!src) return '/images/landing/Partidas.jpg';
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

const modeLabels = {
    '1v1': 'Duelo 1v1',
    '2v2': 'Escuadra 2v2',
    '5v5': 'Competitivo 5v5',
    custom: 'Custom',
};

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

export default function MyMatchesSection({ matches = [], isAuthenticated, onOpenGame }) {
    return (
        <section className="bg-[#090909] px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-red-500">Mis partidas</p>
                        <h2 className="mt-2 text-3xl font-black uppercase italic text-white sm:text-4xl">
                            Tus salas activas
                        </h2>
                    </div>
                </div>

                {!isAuthenticated ? (
                    <div className="rounded-[28px] border border-dashed border-white/10 bg-[#111111] px-6 py-16 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-500">
                            Inicia sesion para ver tus partidas
                        </p>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-white/10 bg-[#111111] px-6 py-16 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-500">
                            Aun no estas unido a ninguna partida
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {matches.map((match) => (
                            <button
                                key={`${match.juego.id}-${match.id}`}
                                type="button"
                                onClick={() => onOpenGame(match.juego.id)}
                                className="group flex items-center gap-4 rounded-[28px] border border-white/10 bg-[#111111] p-4 text-left transition hover:-translate-y-1 hover:border-red-500/40"
                            >
                                <img
                                    src={imgUrl(match.juego.imagen_url)}
                                    alt={match.juego.nombre}
                                    className="h-24 w-20 rounded-2xl object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                                        {match.juego.categoria}
                                    </p>
                                    <h3 className="mt-2 text-lg font-black uppercase text-white">{match.titulo}</h3>
                                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                                        {match.juego.nombre} · {modeLabels[match.tipo] ?? match.tipo}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        {match.fecha_inicio ? dateFormatter.format(new Date(match.fecha_inicio)) : 'Pendiente de confirmar'}
                                    </p>
                                </div>
                                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                    {match.participantes_count}/{match.capacidad}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

import { Link } from '@inertiajs/react';
import { CalendarDays, Trophy, Users } from 'lucide-react';

const imgUrl = (src) => {
    if (!src) return '/images/landing/torneos.jpg';
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

const statusLabels = {
    confirmada: 'Confirmado',
    pendiente: 'Pendiente',
    cancelada: 'Cancelado',
};

export default function MyTournamentsSection({
    tournaments = [],
    isAuthenticated,
    onOpenTournament,
}) {
    return (
        <section className="bg-[radial-gradient(circle_at_top_right,_rgba(227,24,55,0.28),_transparent_48%),radial-gradient(circle_at_18%_78%,_rgba(227,24,55,0.14),_transparent_44%),linear-gradient(180deg,_#141414_0%,_#090909_100%)] px-4 pb-16 pt-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-red-500">
                            Mis torneos
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase italic text-white sm:text-4xl">
                            Tus torneos inscritos
                        </h2>
                    </div>
                    {isAuthenticated && (
                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-300">
                            {tournaments.length}
                        </span>
                    )}
                </div>

                {!isAuthenticated ? (
                    <div className="rounded-[28px] border border-dashed border-white/10 bg-[#0b0b0b] px-6 py-14 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-500">
                            Inicia sesion para ver tus torneos
                        </p>
                        <Link
                            href="/login"
                            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500"
                        >
                            Iniciar sesion
                        </Link>
                    </div>
                ) : tournaments.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-white/10 bg-[#0b0b0b] px-6 py-14 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-500">
                            Aun no estas inscrito en ningun torneo
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {tournaments.map((torneo) => {
                            const status = torneo.inscripcion?.estado ?? 'pendiente';
                            const isPendingPaid = status === 'pendiente' && Number(torneo.cuota_inscripcion) > 0;

                            return (
                                <article
                                    key={`${torneo.id}-${torneo.inscripcion?.id}`}
                                    className="group flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#0b0b0b] p-4 transition hover:-translate-y-1 hover:border-red-500/40 sm:flex-row sm:items-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() => onOpenTournament(torneo.juego?.id)}
                                        className="flex flex-1 items-center gap-4 text-left"
                                    >
                                        <img
                                            src={imgUrl(torneo.juego?.imagen_url)}
                                            onError={(event) => {
                                                event.currentTarget.src = imgUrl(torneo.juego?.imagen_url_local);
                                            }}
                                            alt={torneo.juego?.nombre ?? torneo.nombre}
                                            className="h-24 w-20 rounded-2xl object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                                                    {statusLabels[status] ?? status}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                                                    {torneo.juego?.nombre}
                                                </span>
                                            </div>
                                            <h3 className="mt-3 text-lg font-black uppercase text-white">
                                                {torneo.nombre}
                                            </h3>
                                            <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays size={14} className="text-red-500" />
                                                    {torneo.fecha_inicio ? dateFormatter.format(new Date(torneo.fecha_inicio)) : 'Fecha pendiente'}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Users size={14} className="text-red-500" />
                                                    {torneo.inscripciones_count}/{torneo.max_participantes}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Trophy size={14} className="text-red-500" />
                                                    {Number(torneo.premio_total).toFixed(2)} EUR
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                                        {isPendingPaid && (
                                            <Link
                                                href={route('tournaments.checkout', torneo.id)}
                                                className="rounded-xl bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500"
                                            >
                                                Pagar
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => onOpenTournament(torneo.juego?.id)}
                                            className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition hover:border-white/30 hover:text-white"
                                        >
                                            Ver
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

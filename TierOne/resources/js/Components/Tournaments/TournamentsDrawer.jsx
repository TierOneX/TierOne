import { useEffect, useMemo, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

const currency = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

export default function TournamentsDrawer({ isOpen, game, onClose }) {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const currentUserId = auth?.user?.id ?? null;
    const [drawerMessage, setDrawerMessage] = useState(null);
    const [renderedGame, setRenderedGame] = useState(game);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const joinForm = useForm({});

    useEffect(() => {
        if (isOpen && game) {
            setRenderedGame(game);
            const timeout = setTimeout(() => setIsPanelVisible(true), 20);
            return () => clearTimeout(timeout);
        }

        setIsPanelVisible(false);
        const timeout = setTimeout(() => setRenderedGame(null), 500);
        return () => clearTimeout(timeout);
    }, [game, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setDrawerMessage(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    const openTournaments = useMemo(
        () => (renderedGame?.torneos ?? []).filter((torneo) => torneo.estado === 'inscripciones' || torneo.estado === 'en_curso'),
        [renderedGame],
    );

    const joinTournament = (tournamentId) => {
        joinForm.post(`/tournaments/${tournamentId}/join`, {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props?.flash?.success) {
                    setDrawerMessage({ type: 'success', text: page.props.flash.success });
                }
                if (page.props?.flash?.error) {
                    setDrawerMessage({ type: 'error', text: page.props.flash.error });
                }
            },
            onError: () => {
                setDrawerMessage({ type: 'error', text: 'No se pudo completar la inscripcion al torneo.' });
            },
        });
    };

    if (!renderedGame) return null;

    return (
        <>
            <button
                type="button"
                aria-label="Cerrar panel"
                onClick={onClose}
                className={`fixed inset-x-0 bottom-0 top-16 z-30 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isPanelVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            <aside
                className={`fixed bottom-0 right-0 top-16 z-40 flex w-full max-w-[100vw] flex-col border-l border-white/10 bg-[#0b0b0b] shadow-[-24px_0_80px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-out sm:max-w-[96vw] lg:max-w-[94vw] xl:max-w-[1320px] ${
                    isPanelVisible ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/40 p-2 text-gray-400 backdrop-blur transition hover:border-white/20 hover:text-white sm:left-6"
                    aria-label="Cerrar panel"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative overflow-hidden border-b border-white/10 px-4 py-4 sm:px-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(227,24,55,0.25),_transparent_45%)]" />
                    <div className="relative grid gap-4 pl-12 sm:pl-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                        <div className="lg:min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">Juego seleccionado</p>
                            <h2 className="mt-2 text-2xl font-black uppercase italic text-white sm:text-3xl">{renderedGame.nombre}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:w-[280px]">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Abiertos</p>
                                <p className="mt-1 text-xl font-black text-white sm:text-2xl">{renderedGame.torneos_abiertos}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Totales</p>
                                <p className="mt-1 text-xl font-black text-white sm:text-2xl">{renderedGame.total_torneos}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-white/10 px-4 py-3 sm:px-6">
                    {drawerMessage && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${drawerMessage.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-red-500/20 bg-red-500/10 text-red-300'}`}>
                            {drawerMessage.text}
                        </div>
                    )}
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                    {!isAuthenticated && (
                        <div className="mb-5 rounded-[22px] border border-amber-500/20 bg-amber-500/10 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">Acceso requerido</p>
                            <p className="mt-2 text-sm leading-6 text-amber-100/90">
                                Para unirte a un torneo necesitas iniciar sesion.
                            </p>
                            <Link
                                href="/login"
                                className="mt-4 inline-flex rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white"
                            >
                                Iniciar sesion
                            </Link>
                        </div>
                    )}

                    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                        {openTournaments.length > 0 ? (
                            openTournaments.map((torneo) => {
                                const isJoined = (torneo.inscripciones ?? []).some(
                                    (inscripcion) => inscripcion.id_usuario === currentUserId,
                                );

                                return (
                                    <article key={torneo.id} className="rounded-[22px] border border-white/10 bg-[#101010] p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-base font-black uppercase text-white">{torneo.nombre}</h3>
                                                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                                                    {torneo.formato}
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                                                {torneo.inscripciones_count}/{torneo.max_participantes}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300 sm:grid-cols-4">
                                            <div className="rounded-2xl bg-white/[0.03] p-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Cuota</p>
                                                <p className="mt-2 text-base font-black text-white">{currency.format(torneo.cuota_inscripcion)}</p>
                                            </div>
                                            <div className="rounded-2xl bg-white/[0.03] p-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Premio</p>
                                                <p className="mt-2 text-base font-black text-white">{currency.format(torneo.premio_total)}</p>
                                            </div>
                                            <div className="rounded-2xl bg-white/[0.03] p-3 sm:col-span-2">
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Inicio</p>
                                                <p className="mt-2 truncate text-sm font-semibold text-white">
                                                    {torneo.fecha_inicio ? dateFormatter.format(new Date(torneo.fecha_inicio)) : 'Pendiente'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <p className="text-xs font-semibold text-gray-400">
                                                {torneo.plazas_disponibles} plazas disponibles
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => joinTournament(torneo.id)}
                                                disabled={!isAuthenticated || isJoined || joinForm.processing || torneo.plazas_disponibles === 0}
                                                className="rounded-2xl bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-gray-500"
                                            >
                                                {isJoined ? 'Inscrito' : 'Unirme'}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="rounded-[26px] border border-dashed border-white/10 bg-[#101010] px-6 py-14 text-center">
                                <p className="text-sm font-black uppercase tracking-[0.2em] text-white">No hay torneos abiertos ahora mismo</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

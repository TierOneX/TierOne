import { useEffect, useMemo, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

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
    const [selectedTournamentModal, setSelectedTournamentModal] = useState(null);
    const [joinedTournamentIds, setJoinedTournamentIds] = useState([]);
    const [renderedGame, setRenderedGame] = useState(game);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const joinForm = useForm({});
    const { addToCart } = useCart();

    const handleAddToCart = (torneo) => {
        addToCart({
            id: `torneo-${torneo.id}`,
            nombre: `Inscripción: ${torneo.nombre}`,
            precio_venta: torneo.cuota_inscripcion,
            imagen_principal: renderedGame?.imagen_url,
            torneo_id: torneo.id,
            juego: renderedGame
        }, null, 1, null, 'tournament');
    };

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
            setSelectedTournamentModal(null);
            setShowLoginModal(false);
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
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        joinForm.post(`/tournaments/${tournamentId}/join`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const joinedTournament = (openTournaments ?? []).find((torneo) => torneo.id === tournamentId) ?? null;

                if (page.props?.flash?.success) {
                    setDrawerMessage(null);
                    setSelectedTournamentModal({
                        tournamentId,
                        tournament: joinedTournament,
                        message: page.props.flash.success,
                        type: 'success',
                    });
                    setJoinedTournamentIds((prev) => (prev.includes(tournamentId) ? prev : [...prev, tournamentId]));
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

                {drawerMessage && (
                    <div className="border-b border-white/10 px-4 py-3 sm:px-6">
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                            {drawerMessage.text}
                        </div>
                    </div>
                )}

                <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">

                    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                        {openTournaments.length > 0 ? (
                            openTournaments.map((torneo) => {
                                const isJoined = (torneo.inscripciones ?? []).some(
                                    (inscripcion) => inscripcion.id_usuario === currentUserId,
                                );
                                const isLocallyJoined = joinedTournamentIds.includes(torneo.id);
                                const alreadyJoined = isJoined || isLocallyJoined;

                                return (
                                    <article key={torneo.id} className="flex h-full flex-col rounded-[22px] border border-white/10 bg-[#101010] p-4">
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

                                        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                                            <p className="text-xs font-semibold text-gray-400">
                                                {torneo.plazas_disponibles} plazas disponibles
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToCart(torneo)}
                                                    disabled={alreadyJoined || torneo.plazas_disponibles === 0}
                                                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Añadir al carrito"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => joinTournament(torneo.id)}
                                                    disabled={alreadyJoined || joinForm.processing || torneo.plazas_disponibles === 0}
                                                    className="flex h-11 min-w-[120px] items-center justify-center rounded-2xl bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-gray-500"
                                                >
                                                    {alreadyJoined ? 'Inscrito' : 'Unirme'}
                                                </button>
                                            </div>
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

            {selectedTournamentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        onClick={() => setSelectedTournamentModal(null)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/15 bg-[#0f0f0f] shadow-[0_30px_120px_rgba(0,0,0,0.75)]">
                        <button
                            type="button"
                            onClick={() => setSelectedTournamentModal(null)}
                            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 p-2 text-gray-300 transition hover:text-white"
                            aria-label="Cerrar modal"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
                            <div className="relative min-h-[260px] md:min-h-[420px]">
                                <img
                                    src={selectedTournamentModal.tournament?.imagen_banner || renderedGame?.imagen_url || '/images/landing/torneos.jpg'}
                                    alt={selectedTournamentModal.tournament?.nombre || 'Torneo'}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">Inscripcion completada</p>
                                    <h3 className="mt-2 text-2xl font-black uppercase italic text-white">
                                        {selectedTournamentModal.tournament?.nombre || 'Torneo'}
                                    </h3>
                                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-red-300">
                                        {renderedGame?.nombre || 'Juego'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                                    {selectedTournamentModal.message || 'Te has unido correctamente al torneo.'}
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Precio</p>
                                        <p className="mt-2 text-lg font-black text-white">
                                            {currency.format(selectedTournamentModal.tournament?.cuota_inscripcion ?? 0)}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Personas</p>
                                        <p className="mt-2 text-lg font-black text-white">
                                            {selectedTournamentModal.tournament?.inscripciones_count ?? 0}/{selectedTournamentModal.tournament?.max_participantes ?? 0}
                                        </p>
                                    </div>
                                    <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inicio</p>
                                        <p className="mt-2 text-sm font-semibold text-white">
                                            {selectedTournamentModal.tournament?.fecha_inicio
                                                ? dateFormatter.format(new Date(selectedTournamentModal.tournament.fecha_inicio))
                                                : 'Pendiente'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTournamentModal(null)}
                                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showLoginModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        onClick={() => setShowLoginModal(false)}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#0f0f0f] shadow-[0_40px_150px_rgba(0,0,0,0.9)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(227,24,55,0.15),_transparent_60%)]" />

                        <div className="relative p-8 text-center sm:p-10">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
                                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>

                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-red-500">Acceso restringido</p>
                            <h3 className="mt-4 text-2xl font-black uppercase italic text-white sm:text-3xl">Inicia sesión</h3>
                            <p className="mt-4 text-sm leading-relaxed text-gray-400">
                                Para unirte a la competición y demostrar tu nivel, necesitas formar parte de la comunidad.
                            </p>

                            <div className="mt-10 flex flex-col gap-3">
                                <Link
                                    href="/login?redirect=/tournaments"
                                    className="flex h-14 items-center justify-center rounded-2xl bg-red-600 px-6 text-xs font-black uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(227,24,55,0.3)] transition hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Entrar ahora
                                </Link>
                                <Link
                                    href="/register?redirect=/tournaments"
                                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-xs font-black uppercase tracking-[0.25em] text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
                                >
                                    Crear cuenta
                                </Link>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowLoginModal(false)}
                                className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 transition hover:text-white"
                            >
                                Volver atrás
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

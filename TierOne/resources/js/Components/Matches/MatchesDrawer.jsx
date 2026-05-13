import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

const modeLabels = {
    '1v1': 'Duelo 1v1',
    '2v2': 'Escuadra 2v2',
    '5v5': 'Competitivo 5v5',
    custom: 'Custom',
};

const hcFormatter = (val) => {
    return Number(val || 0).toLocaleString();
};

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

export default function MatchesDrawer({ isOpen, game, games, initialTab = 'list', onClose }) {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const currentUserId = auth?.user?.id ?? null;
    const [activeTab, setActiveTab] = useState('list');
    const [drawerMessage, setDrawerMessage] = useState(null);
    const [renderedGame, setRenderedGame] = useState(game);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const lastFlashKeyRef = useRef(null);
    const createForm = useForm({
        id_juego: game?.id ?? '',
        titulo: game ? `Sala de ${game.nombre}` : '',
        tipo: '5v5',
        buy_in: '0',
        premio_total: '',
        fecha_inicio: '',
    });

    const joinForm = useForm({});

    const showFlashMessage = (page, context = '') => {
        const success = page.props?.flash?.success;
        const error = page.props?.flash?.error;
        const text = success || error;

        if (!text) return;

        const key = `${success ? 'success' : 'error'}:${context}:${text}:${Date.now()}`;
        lastFlashKeyRef.current = key;
        setDrawerMessage({
            type: success ? 'success' : 'error',
            text,
            key,
        });
    };

    useEffect(() => {
        if (!game) return;
        createForm.setData('id_juego', game.id);
        if (!createForm.data.titulo || Number(createForm.data.id_juego) !== game.id) {
            createForm.setData('titulo', `Sala de ${game.nombre}`);
        }
    }, [game]);

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
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [initialTab, isOpen, game?.id]);

    useEffect(() => {
        if (!isOpen) {
            setDrawerMessage(null);
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

    const openMatches = useMemo(
        () => (renderedGame?.partidas ?? []).filter((match) => match.estado === 'pendiente'),
        [renderedGame],
    );

    const submitCreate = (event) => {
        event.preventDefault();
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        createForm.post('/matches', {
            preserveScroll: true,
            onSuccess: (page) => {
                setActiveTab('list');
                createForm.reset('titulo', 'buy_in', 'premio_total', 'fecha_inicio');
                showFlashMessage(page, 'create');
            },
        });
    };

    const joinMatch = (matchId) => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        joinForm.post(`/matches/${matchId}/join`, {
            preserveScroll: true,
            onSuccess: (page) => {
                showFlashMessage(page, `join:${matchId}`);
            },
        });
    };

    const handleClose = () => {
        setDrawerMessage(null);
        setShowLoginModal(false);
        onClose();
    };

    if (!renderedGame) return null;

    return (
        <>
            <button
                type="button"
                aria-label="Cerrar panel"
                onClick={handleClose}
                className={`fixed inset-x-0 bottom-0 top-16 z-30 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isPanelVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            <aside
                className={`fixed bottom-0 right-0 top-16 z-40 flex w-full max-w-[100vw] flex-col border-l border-white/10 bg-[#0b0b0b] shadow-[-24px_0_80px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-out sm:max-w-[96vw] lg:max-w-[94vw] xl:max-w-[1320px] ${
                    isPanelVisible ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <button
                    type="button"
                    onClick={handleClose}
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
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">Juego seleccionado</p>
                                <h2 className="mt-2 text-2xl font-black uppercase italic text-white sm:text-3xl">{renderedGame.nombre}</h2>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400 lg:line-clamp-2">{renderedGame.descripcion}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[380px]">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Abiertas</p>
                                <p className="mt-1 text-xl font-black text-white sm:text-2xl">{renderedGame.partidas_abiertas}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Totales</p>
                                <p className="mt-1 text-xl font-black text-white sm:text-2xl">{renderedGame.total_partidas}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Estado</p>
                                <p className="mt-1 truncate text-xs font-black uppercase text-white sm:text-sm">{isAuthenticated ? auth.user.username : 'Invitado'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-white/10 px-4 py-3 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex gap-3">
                        {[
                            { key: 'list', label: 'Lista de partidas' },
                            { key: 'create', label: 'Crear' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    if (tab.key === 'create') {
                                        setDrawerMessage(null);
                                    }
                                    setActiveTab(tab.key);
                                }}
                                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition ${
                                    activeTab === tab.key
                                        ? 'border-red-500 bg-red-600 text-white'
                                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                        </div>
                        {drawerMessage && (
                            <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold lg:max-w-xl ${drawerMessage.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-red-500/20 bg-red-500/10 text-red-300'}`}>
                                {drawerMessage.text}
                            </div>
                        )}
                    </div>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">

                    {activeTab === 'list' ? (
                        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                            {openMatches.length > 0 ? (
                                openMatches.map((match) => {
                                    const isJoined = (match.participantes ?? []).some(
                                        (participant) => participant.id_usuario === currentUserId,
                                    );

                                    return (
                                        <article key={match.id} className="rounded-[22px] border border-white/10 bg-[#101010] p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-base font-black uppercase text-white">{match.titulo}</h3>
                                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                                                        {modeLabels[match.tipo] ?? match.tipo}
                                                    </p>
                                                </div>
                                                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                                                    {match.participantes_count}/{match.capacidad}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300 sm:grid-cols-4">
                                                <div className="rounded-2xl bg-white/[0.03] p-3 group relative">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Entrada</p>
                                                    <div className="flex items-center gap-1.5 mt-2 transition-transform group-hover:scale-105 duration-300">
                                                        <img src="/assets/hydra-coin.png" className="w-4 h-4 object-contain" alt="" />
                                                        <p className="text-base font-black text-white">{hcFormatter(match.buy_in)}</p>
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black border border-white/10 text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 shadow-2xl z-50 whitespace-nowrap">
                                                        <span className="text-red-500">Hydra</span> Coins
                                                    </div>
                                                </div>
                                                <div className="rounded-2xl bg-white/[0.03] p-3 group relative">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Premio</p>
                                                    <div className="flex items-center gap-1.5 mt-2 transition-transform group-hover:scale-105 duration-300">
                                                        <img src="/assets/hydra-coin.png" className="w-4 h-4 object-contain" alt="" />
                                                        <p className="text-base font-black text-white">{hcFormatter(match.premio_total)}</p>
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black border border-white/10 text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 shadow-2xl z-50 whitespace-nowrap">
                                                        <span className="text-red-500">Hydra</span> Coins
                                                    </div>
                                                </div>
                                                <div className="rounded-2xl bg-white/[0.03] p-3 sm:col-span-2">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Creador</p>
                                                    <p className="mt-2 truncate text-sm font-semibold text-white">
                                                        {match.creador?.nombre || match.creador?.username || 'TierOne Lobby'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {match.fecha_inicio ? dateFormatter.format(new Date(match.fecha_inicio)) : 'Inicio pendiente'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between gap-3">
                                                <p className="text-xs font-semibold text-gray-400">
                                                    {match.slots_disponibles} plazas disponibles
                                                </p>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('matches.show', match.id)}
                                                        className="flex items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-gray-300 transition hover:border-white/30 hover:text-white"
                                                    >
                                                        Detalles
                                                    </Link>
                                                    
                                                    {isAuthenticated && auth.user.balance_tokens < match.buy_in ? (
                                                        <Link
                                                            href="/shop"
                                                            className="rounded-2xl bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2"
                                                        >
                                                            <img src="/assets/hydra-coin.png" className="w-4 h-4 object-contain" alt="" />
                                                            Recargar
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => joinMatch(match.id)}
                                                            disabled={isJoined || joinForm.processing || match.slots_disponibles === 0}
                                                            className="rounded-2xl bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-gray-500"
                                                        >
                                                            {isJoined ? 'Unido' : 'Unirse'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="rounded-[26px] border border-dashed border-white/10 bg-[#101010] px-6 py-14 text-center">
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-white">No hay partidas abiertas ahora mismo</p>
                                    <p className="mt-3 text-sm text-gray-500">Puedes abrir una nueva sala desde la pestaña de crear.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={submitCreate} className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                            <div className="xl:col-span-1">
                                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Juego</label>
                                <select
                                    value={createForm.data.id_juego}
                                    onChange={(event) => createForm.setData('id_juego', event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none"
                                >
                                    {games.map((item) => (
                                        <option key={item.id} value={item.id} className="bg-[#111111]">
                                            {item.nombre}
                                        </option>
                                    ))}
                                </select>
                                {createForm.errors.id_juego && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.id_juego}</p>}
                            </div>

                            <div className="xl:col-span-2">
                                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Titulo</label>
                                <input
                                    type="text"
                                    value={createForm.data.titulo}
                                    onChange={(event) => createForm.setData('titulo', event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none"
                                    placeholder="Ej. Ranked nocturna"
                                />
                                {createForm.errors.titulo && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.titulo}</p>}
                            </div>

                            <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Modalidad</label>
                                    <select
                                        value={createForm.data.tipo}
                                        onChange={(event) => createForm.setData('tipo', event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none"
                                    >
                                        {Object.entries(modeLabels).map(([value, label]) => (
                                            <option key={value} value={value} className="bg-[#111111]">
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {createForm.errors.tipo && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.tipo}</p>}
                            </div>

                            <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Fecha y hora</label>
                                    <input
                                        type="datetime-local"
                                        value={createForm.data.fecha_inicio}
                                        onChange={(event) => createForm.setData('fecha_inicio', event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none"
                                    />
                                    {createForm.errors.fecha_inicio && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.fecha_inicio}</p>}
                            </div>

                            <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Entrada (HC)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <img src="/assets/hydra-coin.png" className="w-5 h-5 object-contain" alt="" />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={createForm.data.buy_in}
                                            onChange={(event) => createForm.setData('buy_in', event.target.value)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-4 py-4 text-sm font-semibold text-white outline-none focus:border-red-500/50 transition-colors"
                                        />
                                    </div>
                                    {createForm.errors.buy_in && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.buy_in}</p>}
                            </div>

                            <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Premio total (HC)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <img src="/assets/hydra-coin.png" className="w-5 h-5 object-contain" alt="" />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={createForm.data.premio_total}
                                            onChange={(event) => createForm.setData('premio_total', event.target.value)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-4 py-4 text-sm font-semibold text-white outline-none focus:border-red-500/50 transition-colors"
                                            placeholder="Se calcula si lo dejas vacio"
                                        />
                                    </div>
                                    {createForm.errors.premio_total && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.premio_total}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="w-full rounded-[22px] bg-red-600 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-900/60 lg:col-span-2 xl:col-span-3"
                            >
                                {createForm.processing ? 'Creando...' : 'Crear partida'}
                            </button>
                        </form>
                    )}
                </div>
            </aside>
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
                                Para participar en las partidas y conectar con otros jugadores, necesitas una cuenta activa.
                            </p>

                            <div className="mt-10 flex flex-col gap-3">
                                <Link
                                    href="/login?redirect=/matches"
                                    className="flex h-14 items-center justify-center rounded-2xl bg-red-600 px-6 text-xs font-black uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(227,24,55,0.3)] transition hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Entrar ahora
                                </Link>
                                <Link
                                    href="/register?redirect=/matches"
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

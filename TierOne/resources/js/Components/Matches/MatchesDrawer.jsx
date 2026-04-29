import { useEffect, useMemo, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

const modeLabels = {
    '1v1': 'Duelo 1v1',
    '2v2': 'Escuadra 2v2',
    '5v5': 'Competitivo 5v5',
    custom: 'Custom',
};

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

export default function MatchesDrawer({ isOpen, game, games, demoUser, onClose }) {
    const { auth, flash } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const [activeTab, setActiveTab] = useState('list');
    const [drawerMessage, setDrawerMessage] = useState(null);
    const createForm = useForm({
        id_juego: game?.id ?? '',
        titulo: game ? `Sala de ${game.nombre}` : '',
        tipo: '5v5',
        buy_in: '0',
        premio_total: '',
        fecha_inicio: '',
    });

    const joinForm = useForm({});

    useEffect(() => {
        if (!game) return;
        createForm.setData('id_juego', game.id);
        if (!createForm.data.titulo || Number(createForm.data.id_juego) !== game.id) {
            createForm.setData('titulo', `Sala de ${game.nombre}`);
        }
    }, [game]);

    useEffect(() => {
        if (!isOpen) {
            setDrawerMessage(null);
            return;
        }

        if (flash?.success) {
            setDrawerMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setDrawerMessage({ type: 'error', text: flash.error });
        }
    }, [flash, isOpen]);

    useEffect(() => {
        if (activeTab === 'create') {
            setDrawerMessage(null);
        }
    }, [activeTab]);

    const openMatches = useMemo(
        () => (game?.partidas ?? []).filter((match) => match.estado === 'pendiente'),
        [game],
    );

    const submitCreate = (event) => {
        event.preventDefault();
        createForm.post('/matches', {
            preserveScroll: true,
            onSuccess: () => {
                setActiveTab('list');
                createForm.reset('titulo', 'buy_in', 'premio_total', 'fecha_inicio');
            },
        });
    };

    const joinMatch = (matchId) => {
        joinForm.post(`/matches/${matchId}/join`, {
            preserveScroll: true,
        });
    };

    const handleClose = () => {
        setDrawerMessage(null);
        onClose();
    };

    if (!game) return null;

    return (
        <>
            <button
                type="button"
                aria-label="Cerrar panel"
                onClick={handleClose}
                className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            <aside
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[560px] flex-col border-l border-white/10 bg-[#0b0b0b] shadow-[-24px_0_80px_rgba(0,0,0,0.65)] transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="relative overflow-hidden border-b border-white/10 px-6 pb-6 pt-24">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(227,24,55,0.25),_transparent_45%)]" />
                    <div className="relative">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">Juego seleccionado</p>
                                <h2 className="mt-2 text-3xl font-black uppercase italic text-white">{game.nombre}</h2>
                                <p className="mt-3 text-sm leading-6 text-gray-400">{game.descripcion}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:border-white/20 hover:text-white"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Abiertas</p>
                                <p className="mt-2 text-2xl font-black text-white">{game.partidas_abiertas}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Totales</p>
                                <p className="mt-2 text-2xl font-black text-white">{game.total_partidas}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Estado</p>
                                <p className="mt-2 truncate text-sm font-black uppercase text-white">{isAuthenticated ? auth.user.username : 'Invitado'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-white/10 px-6 py-4">
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
                        <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${drawerMessage.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-red-500/20 bg-red-500/10 text-red-300'}`}>
                            {drawerMessage.text}
                        </div>
                    )}
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
                    {!isAuthenticated && (
                        <div className="mb-5 rounded-[22px] border border-amber-500/20 bg-amber-500/10 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">Acceso requerido</p>
                            <p className="mt-2 text-sm leading-6 text-amber-100/90">
                                Para crear una partida o unirte a una existente necesitas iniciar sesion.
                            </p>
                            <Link
                                href="/login"
                                className="mt-4 inline-flex rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white"
                            >
                                Iniciar sesion
                            </Link>
                        </div>
                    )}

                    {activeTab === 'list' ? (
                        <div className="space-y-4">
                            {openMatches.length > 0 ? (
                                openMatches.map((match) => (
                                    <article key={match.id} className="rounded-[26px] border border-white/10 bg-[#101010] p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-black uppercase text-white">{match.titulo}</h3>
                                                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                                                    {modeLabels[match.tipo] ?? match.tipo}
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                                                {match.participantes_count}/{match.capacidad}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300">
                                            <div className="rounded-2xl bg-white/[0.03] p-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Entrada</p>
                                                <p className="mt-2 text-base font-black text-white">{currency.format(match.buy_in)}</p>
                                            </div>
                                            <div className="rounded-2xl bg-white/[0.03] p-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Premio</p>
                                                <p className="mt-2 text-base font-black text-white">{currency.format(match.premio_total)}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Creador</p>
                                            <p className="mt-2 text-sm font-semibold text-white">
                                                {match.creador?.nombre || match.creador?.username || 'TierOne Lobby'}
                                            </p>
                                            <p className="mt-2 text-xs text-gray-400">
                                                Inicio {match.fecha_inicio ? dateFormatter.format(new Date(match.fecha_inicio)) : 'pendiente de confirmar'}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <p className="text-xs font-semibold text-gray-400">
                                                {match.slots_disponibles} plazas disponibles
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => joinMatch(match.id)}
                                                disabled={!isAuthenticated || joinForm.processing || match.slots_disponibles === 0}
                                                className="rounded-2xl bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-gray-500"
                                            >
                                                Unirse
                                            </button>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="rounded-[26px] border border-dashed border-white/10 bg-[#101010] px-6 py-14 text-center">
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-white">No hay partidas abiertas ahora mismo</p>
                                    <p className="mt-3 text-sm text-gray-500">Puedes abrir una nueva sala desde la pestaña de crear.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={submitCreate} className="space-y-5">
                            <div>
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

                            <div>
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

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Entrada</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.data.buy_in}
                                        onChange={(event) => createForm.setData('buy_in', event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none"
                                    />
                                    {createForm.errors.buy_in && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.buy_in}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Premio total</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.data.premio_total}
                                        onChange={(event) => createForm.setData('premio_total', event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none"
                                        placeholder="Se calcula si lo dejas vacio"
                                    />
                                    {createForm.errors.premio_total && <p className="mt-2 text-xs font-semibold text-red-400">{createForm.errors.premio_total}</p>}
                                </div>
                            </div>

                            <div className="rounded-[26px] border border-red-500/15 bg-red-500/5 p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Publicacion</p>
                                <p className="mt-3 text-sm leading-6 text-gray-300">
                                    La partida se publica en la base de datos y aparece en la lista de este juego en cuanto se crea correctamente.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!isAuthenticated || createForm.processing}
                                className="w-full rounded-[22px] bg-red-600 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-900/60"
                            >
                                {createForm.processing ? 'Creando...' : 'Crear partida'}
                            </button>
                        </form>
                    )}
                </div>
            </aside>
        </>
    );
}

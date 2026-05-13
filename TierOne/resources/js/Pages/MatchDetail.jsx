import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Trophy, Users, Calendar, DollarSign, ArrowLeft, Shield, Sword, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const imgUrl = (src) => {
    if (!src) return '/images/landing/Partidas.jpg';
    return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

const hcFormatter = (val) => {
    return Number(val || 0).toLocaleString();
};

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

export default function MatchDetail({ partida }) {
    const { auth, flash } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const currentUserId = auth?.user?.id;
    const [imgError, setImgError] = useState(false);

    const joinForm = useForm({});
    const leaveForm = useForm({});

    const isJoined = useMemo(() => 
        partida.participantes.some(p => p.id_usuario === currentUserId),
    [partida.participantes, currentUserId]);

    const teamA = useMemo(() => 
        partida.participantes.filter(p => p.equipo_asignado === 'team_a'),
    [partida.participantes]);

    const teamB = useMemo(() => 
        partida.participantes.filter(p => p.equipo_asignado === 'team_b'),
    [partida.participantes]);

    const handleJoin = () => {
        joinForm.post(route('matches.join', partida.id), {
            preserveScroll: true,
        });
    };

    const handleLeave = () => {
        leaveForm.delete(route('matches.leave', partida.id), {
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <Head title={`${partida.titulo} - ${partida.juego?.nombre}`} />

            {/* HERO SECTION */}
            <div className="relative min-h-[500px] w-full overflow-hidden bg-[#050505]">
                {/* Background Image with Atmospheric Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={imgError ? imgUrl(partida.juego?.imagen_url_local) : imgUrl(partida.juego?.imagen_url)} 
                        alt={partida.juego?.nombre}
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover opacity-20 scale-110 blur-md transition-opacity duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-32 pb-16 sm:px-6 lg:px-8">
                    <Link 
                        href={route('matches')} 
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al Matchmaking
                    </Link>

                    <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-[10px] font-black uppercase tracking-widest text-red-500">
                                    {partida.juego?.categoria}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {partida.tipo}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    partida.estado === 'pendiente' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
                                }`}>
                                    {partida.estado === 'pendiente' ? 'Abierta' : 'En Curso'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black uppercase italic text-white tracking-tighter leading-none mb-6 font-['Outfit']">
                                {partida.titulo}
                            </h1>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md w-fit">
                                <img 
                                    src={imgError ? imgUrl(partida.juego?.imagen_url_local) : imgUrl(partida.juego?.imagen_url)} 
                                    className="w-12 h-12 rounded-xl object-cover border border-white/10" 
                                    alt=""
                                />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Videojuego</p>
                                    <p className="text-lg font-black text-white italic">{partida.juego?.nombre}</p>
                                </div>
                            </div>
                        </div>

                        {/* ACTION CARD */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-amber-600 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-[#0b0b0b] border border-white/10 rounded-[30px] p-8 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                        <div className="group relative">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Precio Entrada</p>
                                            <div className="flex items-center gap-3 transition-transform group-hover:scale-105 duration-300">
                                                <img src="/assets/hydra-coin.png" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(227,24,55,0.4)]" alt="HC" />
                                                <p className="text-4xl font-black text-white italic leading-none">{hcFormatter(partida.buy_in)}</p>
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute -top-12 left-0 px-3 py-2 rounded-lg bg-black border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-2xl z-50 whitespace-nowrap">
                                                <span className="text-red-500">Hydra</span> Coins
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group relative">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Premio</p>
                                            <div className="flex items-center gap-2 text-white font-black transition-transform group-hover:scale-105 duration-300">
                                                <img src="/assets/hydra-coin.png" className="w-4 h-4 object-contain" alt="HC" />
                                                <span>{hcFormatter(partida.premio_total)}</span>
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black border border-white/10 text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-2xl z-50 whitespace-nowrap">
                                                <span className="text-red-500">Hydra</span> Coins
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Jugadores</p>
                                            <div className="flex items-center gap-2 text-white font-black">
                                                <Users size={16} className="text-blue-500" />
                                                <span>{partida.participantes_count} / {partida.capacidad}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Comienza el</p>
                                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                                            <Calendar size={16} className="text-red-500" />
                                            <span>{dateFormatter.format(new Date(partida.fecha_inicio))}</span>
                                        </div>
                                    </div>

                                    {!isAuthenticated ? (
                                        <Link 
                                            href={route('login', { redirect: route('matches.show', partida.id) })}
                                            className="w-full h-14 flex items-center justify-center bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-[0.98]"
                                        >
                                            Inicia Sesión para Jugar
                                        </Link>
                                    ) : isJoined ? (
                                        <button 
                                            onClick={handleLeave}
                                            disabled={leaveForm.processing}
                                            className="w-full h-14 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-600/10 hover:border-red-600/30 hover:text-red-500 transition-all active:scale-[0.98]"
                                        >
                                            <LogOut size={16} />
                                            Abandonar Partida
                                        </button>
                                    ) : auth.user.balance_tokens < partida.buy_in ? (
                                        <Link 
                                            href="/shop"
                                            className="w-full h-14 flex items-center justify-center gap-2 px-6 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-[0.98]"
                                        >
                                            <img src="/assets/hydra-coin.png" className="w-5 h-5 object-contain" alt="" />
                                            Recargar para jugar
                                        </Link>
                                    ) : (
                                        <button 
                                            onClick={handleJoin}
                                            disabled={joinForm.processing || partida.slots_disponibles === 0}
                                            className="w-full h-14 flex items-center justify-center gap-2 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 transition-all shadow-[0_10px_40px_rgba(220,38,38,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-red-600 disabled:cursor-not-allowed"
                                        >
                                            <UserPlus size={16} />
                                            Unirse a la Partida
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TEAMS SECTION */}
            <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-2 relative">
                    {/* Versus Badge */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
                        <div className="w-20 h-20 rounded-full bg-[#050505] border-2 border-white/10 flex items-center justify-center">
                            <span className="text-3xl font-black italic text-white tracking-tighter">VS</span>
                        </div>
                    </div>

                    {/* TEAM A */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500">
                                <Shield size={24} />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic text-white tracking-tight">TEAM ALPHA</h2>
                        </div>

                        <div className="grid gap-4">
                            {teamA.length > 0 ? teamA.map((player) => (
                                <PlayerCard key={player.id} player={player} isCurrent={player.id_usuario === currentUserId} />
                            )) : (
                                <div className="p-8 rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] text-center">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Esperando jugadores...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TEAM B */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 lg:flex-row-reverse">
                            <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
                                <Sword size={24} />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic text-white tracking-tight lg:text-right">TEAM BETA</h2>
                        </div>

                        <div className="grid gap-4">
                            {teamB.length > 0 ? teamB.map((player) => (
                                <PlayerCard key={player.id} player={player} isCurrent={player.id_usuario === currentUserId} />
                            )) : (
                                <div className="p-8 rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] text-center">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Esperando jugadores...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CREATOR INFO */}
            <div className="mx-auto max-w-[1400px] px-4 pb-32 sm:px-6 lg:px-8">
                <div className="p-8 rounded-[32px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 flex flex-wrap items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                            {partida.creador?.username?.[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-1">Organizado por</p>
                            <h3 className="text-xl font-black text-white uppercase italic">{partida.creador?.username}</h3>
                            <p className="text-xs font-medium text-gray-500 italic">{partida.creador?.nombre}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Estado de Partida</p>
                            <p className="text-white font-bold uppercase tracking-widest text-sm mt-1">{partida.estado === 'pendiente' ? 'Reclutando Jugadores' : 'Partida Cerrada'}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function PlayerCard({ player, isCurrent }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
            isCurrent 
                ? 'bg-red-600/10 border-red-600/30' 
                : 'bg-white/[0.03] border-white/5 hover:border-white/20'
        }`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white ${
                    isCurrent ? 'bg-red-600' : 'bg-white/10'
                }`}>
                    {player.username?.[0].toUpperCase()}
                </div>
                <div>
                    <h4 className="font-black text-white uppercase italic text-sm tracking-tight">{player.username}</h4>
                    {isCurrent && <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Eres tú</span>}
                </div>
            </div>
            {player.confirmado && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Listo</span>
                </div>
            )}
        </div>
    );
}

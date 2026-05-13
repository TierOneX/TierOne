import { Link } from '@inertiajs/react';

const HYDRA_PACKS = [
    {
        id: 'pack_1',
        name: 'Pack Iniciación',
        hc: 500,
        price: 4.99,
        popular: false,
        color: 'from-blue-500/20 to-blue-600/20',
        borderColor: 'border-blue-500/30'
    },
    {
        id: 'pack_2',
        name: 'Pack Competitivo',
        hc: 1200,
        price: 9.99,
        popular: true,
        color: 'from-red-500/20 to-red-600/20',
        borderColor: 'border-red-500/40'
    },
    {
        id: 'pack_3',
        name: 'Pack Pro Gamer',
        hc: 3000,
        price: 24.99,
        popular: false,
        color: 'from-amber-500/20 to-amber-600/20',
        borderColor: 'border-amber-500/30'
    },
    {
        id: 'pack_4',
        name: 'Pack Leyenda',
        hc: 7500,
        price: 49.99,
        popular: false,
        color: 'from-purple-500/20 to-purple-600/20',
        borderColor: 'border-purple-500/30'
    }
];

export default function HydraPacks() {
    return (
        <section className="bg-[#0a0a0a] px-4 py-16">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-red-500 mb-3">Suministro de Energía</p>
                        <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter">Hydra Coins (HC)</h2>
                        <p className="mt-4 text-gray-400 max-w-xl text-sm font-medium leading-relaxed">
                            La moneda oficial de TierOne para participar en partidas y torneos premium. 
                            Sin dinero real en los lobbies, solo competición pura.
                        </p>
                    </div>
                    
                    <div className="hidden lg:block">
                         <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-xl font-black text-white shadow-[0_0_20px_rgba(227,24,55,0.4)]">H</div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Saldo Virtual</p>
                                <p className="text-sm font-black text-white">Seguro y transparente</p>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {HYDRA_PACKS.map((pack) => (
                        <div 
                            key={pack.id}
                            className={`group relative overflow-hidden rounded-[32px] border ${pack.borderColor} bg-gradient-to-br ${pack.color} p-8 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
                        >
                            {pack.popular && (
                                <div className="absolute top-4 right-4 bg-red-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                                    Popular
                                </div>
                            )}

                            <div className="mb-6 flex items-center justify-center h-20 w-20 mx-auto rounded-3xl bg-black/40 border border-white/10 group-hover:scale-110 transition-all duration-500 relative">
                                <div className="absolute inset-0 bg-red-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
                                <img 
                                    src="/assets/hydra-coin.png" 
                                    alt="Hydra Coin" 
                                    className="relative w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(227,24,55,0.6)]"
                                />
                            </div>

                            <div className="text-center">
                                <h3 className="text-lg font-black uppercase text-white mb-1">{pack.name}</h3>
                                <p className="text-3xl font-black text-white mb-6">
                                    {pack.hc.toLocaleString()} <span className="text-xs text-red-500 ml-1 italic tracking-widest">HC</span>
                                </p>
                                
                                <div className="mt-auto">
                                    <button className="w-full h-14 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-[0.2em] transition hover:bg-red-600 hover:text-white shadow-xl">
                                        €{pack.price}
                                    </button>
                                </div>
                            </div>

                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

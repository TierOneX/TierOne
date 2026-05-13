import { Link } from '@inertiajs/react';

const HYDRA_PACKS = [
    {
        id: 'pack_1',
        name: 'Iniciación',
        hc: 500,
        price: 4.99,
        popular: false,
        color: 'from-blue-500/10 to-blue-600/5',
        borderColor: 'border-blue-500/20'
    },
    {
        id: 'pack_2',
        name: 'Competitivo',
        hc: 1200,
        price: 9.99,
        popular: true,
        color: 'from-red-500/10 to-red-600/5',
        borderColor: 'border-red-500/30'
    },
    {
        id: 'pack_3',
        name: 'Pro Gamer',
        hc: 3000,
        price: 24.99,
        popular: false,
        color: 'from-amber-500/10 to-amber-600/5',
        borderColor: 'border-amber-500/20'
    },
    {
        id: 'pack_4',
        name: 'Leyenda',
        hc: 7500,
        price: 49.99,
        popular: false,
        color: 'from-purple-500/10 to-purple-600/5',
        borderColor: 'border-purple-500/20'
    }
];

export default function HydraPacks() {
    return (
        <section className="relative bg-[#050505] px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="mx-auto max-w-7xl relative z-10">
                <div className="mb-16">
                    <p className="mb-4 text-[11px] font-black uppercase tracking-[0.4em] text-red-500">
                        Virtual Economy
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
                        Suministro <br />
                        <span className="text-red-600">Hydra Coins</span>
                    </h2>
                    <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <p className="max-w-xl text-lg font-medium leading-relaxed text-gray-400">
                            La moneda exclusiva de TierOne para acceder a competiciones de élite. 
                            Participa en partidas y torneos premium sin complicaciones.
                        </p>
                        
                        <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                            <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center">
                                <img src="/assets/hydra-coin.png" className="w-8 h-8 object-contain" alt="" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Uso Exclusivo</p>
                                <p className="text-sm font-black text-white italic">Gaming Ecosystem</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {HYDRA_PACKS.map((pack) => (
                        <div 
                            key={pack.id}
                            className={`group relative overflow-hidden rounded-[40px] border ${pack.borderColor} bg-white/[0.02] p-10 transition-all duration-500 hover:-translate-y-3 hover:bg-white/[0.04] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]`}
                        >
                            {/* Card Background Glow */}
                            <div className={`absolute -inset-px bg-gradient-to-br ${pack.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 h-full flex flex-col">
                                {pack.popular && (
                                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[8px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.4)] z-20">
                                        Más popular
                                    </div>
                                )}

                                <div className="mb-10 flex items-center justify-center h-28 w-28 mx-auto rounded-[35px] bg-black/40 border border-white/10 group-hover:border-white/20 transition-all duration-500 relative">
                                    <div className="absolute inset-0 bg-red-600 rounded-[35px] blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
                                    <img 
                                        src="/assets/hydra-coin.png" 
                                        alt="Hydra Coin" 
                                        className="relative w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                <div className="text-center mt-auto">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Pack {pack.name}</p>
                                    <h3 className="text-4xl font-black text-white mb-8 italic tracking-tighter">
                                        {pack.hc.toLocaleString()}
                                        <span className="text-xs text-red-600 ml-2 not-italic tracking-[0.2em] uppercase">HC</span>
                                    </h3>
                                    
                                    <Link 
                                        href={route('hydra.checkout', pack.id)}
                                        className="group/btn relative flex items-center justify-center w-full h-16 overflow-hidden rounded-[20px] bg-white text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        <span className="relative z-10 text-sm font-black uppercase tracking-widest group-hover/btn:text-white transition-colors">
                                            Comprar por €{pack.price}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

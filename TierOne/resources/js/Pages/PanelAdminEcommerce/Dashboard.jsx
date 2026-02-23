
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import { Head, Link } from '@inertiajs/react';

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-orange-50 text-orange-700 border-orange-200',
        procesando: 'bg-blue-50 text-blue-700 border-blue-200',
        enviada: 'bg-purple-50 text-purple-700 border-purple-200',
        entregada: 'bg-green-50 text-green-700 border-green-200',
        cancelada: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700 border-gray-200';
};

export default function Dashboard({ stats = {}, ordenes_recientes = [] }) {
    return (
        <PanelLayout title="Dashboard Estratégico" activeItem="Dashboard">
            <Head title="Admin Dashboard - TierOne" />

            {/* HEADER CON TEXTO DE BIENVENIDA */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Visión General</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest opacity-70">Monitorización de rendimiento en tiempo real</p>
            </div>

            {/* STATS PREMIUM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* VENTAS */}
                <div className="stat-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl text-green-600 font-bold text-xl shadow-sm border border-green-100">
                            €
                        </div>
                        <span className="text-[10px] font-black text-green-500 bg-green-50/50 px-2 py-1 rounded-lg border border-green-100 uppercase">Este Mes</span>
                    </div>
                    <div className="stat-value text-3xl font-black text-gray-900 tracking-tighter">
                        €{Number(stats.ventas_mes ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 opacity-80">Volumen de Ventas</div>
                </div>

                {/* PEDIDOS HOY */}
                <div className="stat-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 font-bold text-xl shadow-sm border border-blue-100">
                            📦
                        </div>
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100 uppercase">Hoy</span>
                    </div>
                    <div className="stat-value text-3xl font-black text-gray-900 tracking-tighter">
                        {stats.ordenes_hoy ?? 0}
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 opacity-80">Nuevos Pedidos</div>
                </div>

                {/* USUARIOS */}
                <div className="stat-card group hover:scale-[1.02] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 font-bold text-xl shadow-sm border border-purple-100">
                            👥
                        </div>
                        <span className="text-[10px] font-black text-purple-500 bg-purple-50/50 px-2 py-1 rounded-lg border border-purple-100 uppercase">Crecimiento</span>
                    </div>
                    <div className="stat-value text-3xl font-black text-gray-900 tracking-tighter">
                        +{stats.usuarios_mes ?? 0}
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 opacity-80">Clientes Nuevos</div>
                </div>

                {/* RATING */}
                <div className="stat-card group hover:scale-[1.02] transition-all duration-300 border-amber-100/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 font-bold text-xl shadow-sm border border-amber-100">
                            ⭐
                        </div>
                        <span className="text-[10px] font-black text-amber-500 bg-amber-50/50 px-2 py-1 rounded-lg border border-amber-100 uppercase">Satisfacción</span>
                    </div>
                    <div className="stat-value text-3xl font-black text-gray-900 tracking-tighter">
                        {Number(stats.rating_promedio ?? 0).toFixed(1)} <span className="text-sm text-gray-300 font-bold">/ 5.0</span>
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 opacity-80">Rating Global</div>
                </div>
            </div>

            {/* SECCIÓN DE ACTIVIDAD RECIENTE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* TABLA DE ÓRDENES */}
                <div className="lg:col-span-2 section shadow-xl border-gray-50">
                    <div className="section-header border-b border-gray-50 pb-4 mb-6">
                        <h3 className="section-title text-black text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Últimas Operaciones
                        </h3>
                        <Link href={route('panel.ecommerce.orders')} className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline">Gestionar Todo</Link>
                    </div>

                    <div className="table-container !margin-0 !padding-0">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th className="text-[10px] font-black text-gray-300 uppercase tracking-widest pb-4">Orden</th>
                                    <th className="text-[10px] font-black text-gray-300 uppercase tracking-widest pb-4">Cliente</th>
                                    <th className="text-[10px] font-black text-gray-300 uppercase tracking-widest pb-4 text-right">Monto</th>
                                    <th className="text-[10px] font-black text-gray-300 uppercase tracking-widest pb-4 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {ordenes_recientes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-300 font-bold italic">No hay actividad reciente</td>
                                    </tr>
                                ) : ordenes_recientes.map((orden) => (
                                    <tr key={orden.id} className="group hover:bg-gray-50/50 transition-all duration-200">
                                        <td className="py-4 font-black text-black">#{orden.numero}</td>
                                        <td className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{orden.cliente}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">{orden.fecha}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right font-black text-black group-hover:text-blue-600 transition-colors">
                                            €{Number(orden.total).toFixed(2)}
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border tracking-tighter ${estadoBadge(orden.estado)}`}>
                                                {orden.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* STATUS DEL SISTEMA SIDEBAR */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
                        <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Estado del Sistema
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-tight">API Gateway</span>
                                <span className="text-green-500 font-black">ONLINE</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-tight">Base de Datos</span>
                                <span className="text-green-500 font-black">ÓPTIMA</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-tight">Sinc. Proveedores</span>
                                <span className="text-blue-400 font-black">ACTIVA</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl border border-blue-500 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <h4 className="text-white text-sm font-black uppercase tracking-widest mb-2">Acceso Rápido</h4>
                        <p className="text-blue-100 text-xs font-medium mb-4 opacity-80 leading-relaxed">¿Necesitas lanzar un nuevo producto?</p>
                        <Link
                            href={route('panel.ecommerce.products')}
                            className="inline-block bg-white text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                            Ir a Catálogo
                        </Link>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}

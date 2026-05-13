import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Euro,
    Package,
    Users,
    Star,
    TrendingUp,
    Calendar,
    Activity,
    ShieldCheck,
    Globe,
    ArrowRight,
} from "lucide-react";

const estadoBadge = (estado) => {
    const map = {
        pendiente: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        procesando: "bg-red-500/10 text-red-400 border-red-500/20",
        enviada: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        entregada: "bg-green-500/10 text-green-400 border-green-500/20",
        cancelada: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return map[estado] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
};

export default function Dashboard({ stats = {}, ordenes_recientes = [] }) {
    return (
        <PanelLayout title="Dashboard Estratégico" activeItem="Dashboard">
            <Head title="Admin Dashboard - TierOne" />

            {/* HEADER CON TEXTO DE BIENVENIDA */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 italic font-['Outfit']">
                        Visión General
                    </h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                        Monitorización de rendimiento en tiempo real
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <Calendar size={12} className="text-red-500" />
                    {new Date().toLocaleDateString("es-ES", {
                        month: "long",
                        year: "numeric",
                    })}
                </div>
            </div>

            {/* STATS PREMIUM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* VENTAS */}
                <div className="stat-card group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all">
                            <Euro size={20} />
                        </div>
                        <span className="text-[10px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20 uppercase tracking-widest">
                            Este Mes
                        </span>
                    </div>
                    <div className="stat-value text-3xl font-black text-white tracking-tighter">
                        €
                        {Number(stats.ventas_mes ?? 0).toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                        })}
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 opacity-80 flex items-center gap-1">
                        <TrendingUp size={10} className="text-green-500" />{" "}
                        Volumen de Ventas
                    </div>
                </div>

                {/* PEDIDOS HOY */}
                <div className="stat-card group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all">
                            <Package size={20} />
                        </div>
                        <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 uppercase tracking-widest">
                            Hoy
                        </span>
                    </div>
                    <div className="stat-value text-3xl font-black text-white tracking-tighter">
                        {stats.ordenes_hoy ?? 0}
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 opacity-80">
                        Nuevos Pedidos
                    </div>
                </div>

                {/* USUARIOS */}
                <div className="stat-card group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                            <Users size={20} />
                        </div>
                        <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20 uppercase tracking-widest">
                            Crecimiento
                        </span>
                    </div>
                    <div className="stat-value text-3xl font-black text-white tracking-tighter">
                        +{stats.usuarios_mes ?? 0}
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 opacity-80">
                        Clientes Nuevos
                    </div>
                </div>

                {/* RATING */}
                <div className="stat-card group border-amber-500/20">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 uppercase tracking-widest">
                            Satisfacción
                        </span>
                    </div>
                    <div className="stat-value text-3xl font-black text-white tracking-tighter">
                        {Number(stats.rating_promedio ?? 0).toFixed(1)}{" "}
                        <span className="text-sm text-gray-600 font-bold">
                            / 5.0
                        </span>
                    </div>
                    <div className="stat-label text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 opacity-80">
                        Rating Global
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE ACTIVIDAD RECIENTE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* TABLA DE ÓRDENES */}
                <div className="lg:col-span-2 section">
                    <div className="section-header border-b border-white/5 pb-4 mb-6">
                        <h3 className="section-title text-white text-sm font-black uppercase tracking-[0.2em] italic font-['Outfit'] flex items-center gap-2">
                            <Activity size={16} className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                            Últimas Operaciones
                        </h3>
                        <Link
                            href={route("panel.ecommerce.orders")}
                            className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1 group"
                        >
                            Gestionar Todo{" "}
                            <ArrowRight
                                size={10}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>

                    <div className="table-container">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th className="pb-4">Orden</th>
                                    <th className="pb-4">Cliente</th>
                                    <th className="pb-4 text-right">Monto</th>
                                    <th className="pb-4 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {ordenes_recientes.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-12 text-center text-gray-500 font-bold italic"
                                        >
                                            No hay actividad reciente
                                        </td>
                                    </tr>
                                ) : (
                                    ordenes_recientes.map((orden) => (
                                        <tr
                                            key={orden.id}
                                            className="group transition-all duration-200"
                                        >
                                            <td className="py-4 font-black text-white">
                                                #{orden.numero}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-sm">
                                                        {orden.cliente}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-medium">
                                                        {orden.fecha}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right font-black text-white group-hover:text-red-500 transition-colors">
                                                €
                                                {Number(orden.total).toFixed(2)}
                                            </td>
                                            <td className="py-4 text-center">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border tracking-tighter ${estadoBadge(orden.estado)}`}
                                                >
                                                    {orden.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* STATUS DEL SISTEMA SIDEBAR */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
                        <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-green-500" />
                            Estado del Sistema
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-tight flex items-center gap-2">
                                    <Globe size={10} /> API Gateway
                                </span>
                                <span className="text-green-500 font-black">
                                    ONLINE
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-tight">
                                    Base de Datos
                                </span>
                                <span className="text-green-500 font-black">
                                    ÓPTIMA
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-tight">
                                    Sinc. Proveedores
                                </span>
                                <span className="text-red-400 font-black">
                                    ACTIVA
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-2xl border border-red-500 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <h4 className="text-white text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Package size={18} /> Acceso Rápido
                        </h4>
                        <p className="text-red-100 text-xs font-medium mb-4 opacity-80 leading-relaxed">
                            ¿Necesitas lanzar un nuevo producto?
                        </p>
                        <Link
                            href={route("panel.ecommerce.products")}
                            className="inline-block bg-white text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                            Ir a Catálogo
                        </Link>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}

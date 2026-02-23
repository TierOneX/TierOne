
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import { Head, Link } from '@inertiajs/react';

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-orange-50 text-orange-700 border border-orange-200',
        procesando: 'bg-blue-50 text-blue-700 border border-blue-200',
        enviada: 'bg-purple-50 text-purple-700 border border-purple-200',
        entregada: 'bg-green-50 text-green-700 border border-green-200',
        cancelada: 'bg-gray-100 text-gray-700 border border-gray-200',
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700 border border-gray-200';
};

export default function Dashboard({ stats = {}, ordenes_recientes = [] }) {
    return (
        <PanelLayout title="Dashboard Ecommerce" activeItem="Dashboard">
            <Head title="Admin Dashboard - TierOne" />

            {/* STATS */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon green">$</div>
                    </div>
                    <div className="stat-value">€{Number(stats.ventas_mes ?? 0).toFixed(2)}</div>
                    <div className="stat-label">Ventas del Mes</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon blue">📦</div>
                    </div>
                    <div className="stat-value">{stats.ordenes_activas ?? 0}</div>
                    <div className="stat-label">Órdenes Activas</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon purple">👕</div>
                    </div>
                    <div className="stat-value">{stats.productos_activos ?? 0}</div>
                    <div className="stat-label">Productos Activos</div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-header">
                        <div className="stat-icon orange">⚠️</div>
                    </div>
                    <div className="stat-value">{stats.stock_bajo ?? 0}</div>
                    <div className="stat-label">Stock Bajo</div>
                </div>
            </div>

            {/* RECENT ORDERS */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title text-black">📦 Órdenes Recientes</h2>
                    <Link href={route('panel.ecommerce.orders')} className="section-link">Ver todas</Link>
                </div>

                <div className="table-container">
                    <table className="text-black">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-gray-400 font-black text-[10px] uppercase tracking-widest">ORDEN</th>
                                <th className="text-gray-400 font-black text-[10px] uppercase tracking-widest">CLIENTE</th>
                                <th className="text-gray-400 font-black text-[10px] uppercase tracking-widest">FECHA</th>
                                <th className="text-gray-400 font-black text-[10px] uppercase tracking-widest text-right">TOTAL</th>
                                <th className="text-gray-400 font-black text-[10px] uppercase tracking-widest text-center">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {ordenes_recientes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>📭</span>
                                            <p className="font-medium">No hay órdenes recientes</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : ordenes_recientes.map((orden) => (
                                <tr key={orden.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 font-bold text-black border-b border-gray-50">#{orden.numero}</td>
                                    <td className="py-4 border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                                                {orden.cliente?.charAt(0)?.toUpperCase() ?? '?'}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm">{orden.cliente}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-xs font-medium text-gray-400 border-b border-gray-50">{orden.fecha}</td>
                                    <td className="py-4 text-right border-b border-gray-50 font-black text-black">€{Number(orden.total).toFixed(2)}</td>
                                    <td className="py-4 text-center border-b border-gray-50">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${estadoBadge(orden.estado)}`}>
                                            {orden.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </PanelLayout>
    );
}

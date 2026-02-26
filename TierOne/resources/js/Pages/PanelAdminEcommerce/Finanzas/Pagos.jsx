import React from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import { Head, Link, router } from "@inertiajs/react";
import { CreditCard, Euro, Calendar, User, Hash, Receipt } from "lucide-react";

const estadoBadge = (estado) => {
    const map = {
        pendiente: "bg-orange-50 text-orange-700 border-orange-200",
        completado: "bg-green-50 text-green-700 border-green-200",
        fallido: "bg-red-50 text-red-700 border-red-200",
        reembolsado: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return map[estado] ?? "bg-gray-100 text-gray-800 border-gray-200";
};

export default function Pagos({ pagos, filters = {} }) {
    const { data = [], links = [] } = pagos ?? {};

    const filtersConfig = [
        {
            name: "metodo",
            label: "Método",
            type: "select",
            options: [
                { value: "tarjeta", label: "Tarjeta" },
                { value: "paypal", label: "PayPal" },
                { value: "transferencia", label: "Transferencia" },
                { value: "balance", label: "Balance" },
            ],
        },
        {
            name: "estado",
            label: "Estado",
            type: "select",
            options: [
                { value: "pendiente", label: "Pendiente" },
                { value: "completado", label: "Completado" },
                { value: "fallido", label: "Fallido" },
                { value: "reembolsado", label: "Reembolsado" },
            ],
        },
        { name: "fecha_desde", label: "Desde", type: "date" },
        { name: "fecha_hasta", label: "Hasta", type: "date" },
    ];

    const columns = [
        { label: "Transacción ID", key: "id_transaccion", sortable: false },
        { label: "Orden", key: "numero_orden", sortable: false },
        { label: "Cliente", key: "cliente", sortable: false },
        { label: "Método", key: "metodo", sortable: false },
        { label: "Fecha", key: "fecha", sortable: true },
        { label: "Estado", key: "estado", sortable: false, align: "center" },
        { label: "Monto", key: "monto", sortable: true, align: "right" },
    ];

    const handleSort = (key) => {
        let newDir = "asc";
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === "asc" ? "desc" : "asc";
        }
        router.get(
            route("panel.ecommerce.finanzas.pagos"),
            { ...filters, sort_by: key, sort_dir: newDir },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const renderRow = (pago) => (
        <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <Hash size={12} className="text-gray-300" />
                    {pago.id_transaccion}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Receipt size={14} className="text-blue-500" />
                    <span className="font-bold text-gray-900">
                        #{pago.numero_orden}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {pago.cliente}
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    {pago.metodo}
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <Calendar size={12} />
                    {pago.fecha}
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${estadoBadge(pago.estado)}`}
                >
                    {pago.estado}
                </span>
            </td>
            <td className="px-6 py-4 font-bold text-gray-900">
                <div className="flex items-center justify-end gap-1">
                    <Euro size={14} className="text-gray-400" />
                    {Number(pago.monto).toFixed(2)}
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Gestión de Pagos" activeItem="Pagos">
            <Head title="Pagos - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                    Sincronización de Pagos
                </h2>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.finanzas.pagos"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
            />

            {links.length > 3 && (
                <div className="flex justify-center gap-1 mt-6">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? "#"}
                            className={`px-3 py-1 rounded text-sm border ${
                                link.active
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            } ${!link.url ? "opacity-40 pointer-events-none" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </PanelLayout>
    );
}

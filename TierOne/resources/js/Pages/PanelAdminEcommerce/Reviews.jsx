import React from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import { Head, Link, router } from "@inertiajs/react";
import {
    Star,
    Trash2,
    CheckCircle2,
    Calendar,
    MessageSquare,
    Package,
    User,
} from "lucide-react";

export default function Reviews({ reviews, filters = {} }) {
    const { data = [], links = [] } = reviews ?? {};

    const filtersConfig = [
        {
            name: "calificacion",
            label: "Estrellas",
            type: "select",
            options: [
                { value: "5", label: "5 Estrellas" },
                { value: "4", label: "4 Estrellas" },
                { value: "3", label: "3 Estrellas" },
                { value: "2", label: "2 Estrellas" },
                { value: "1", label: "1 Estrella" },
            ],
        },
        {
            name: "verificado",
            label: "Compra Verificada",
            type: "select",
            options: [
                { value: "1", label: "Sí" },
                { value: "0", label: "No" },
            ],
        },
    ];

    const columns = [
        { label: "Producto", key: "producto", sortable: false },
        { label: "Usuario", key: "usuario", sortable: false },
        { label: "Calificación", key: "calificacion", sortable: true },
        { label: "Comentario", key: "comentario", sortable: false },
        { label: "Fecha", key: "fecha", sortable: true },
        { label: "Acciones", key: "acciones", sortable: false },
    ];

    const handleSort = (key) => {
        let newDir = "asc";
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === "asc" ? "desc" : "asc";
        }
        router.get(
            route("panel.ecommerce.reviews"),
            { ...filters, sort_by: key, sort_dir: newDir },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const deleteReview = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
            router.delete(route("panel.ecommerce.reviews.destroy", id));
        }
    };

    const renderRow = (r) => (
        <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Package size={14} className="text-gray-400" />
                    {r.producto}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                    <User size={14} className="text-gray-400" />
                    {r.usuario}
                    {r.verificado && (
                        <span
                            className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100"
                            title="Compra verificada"
                        >
                            <CheckCircle2 size={10} /> Verificado
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={
                                i < r.calificacion
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200"
                            }
                        />
                    ))}
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                <p className="line-clamp-2 leading-relaxed flex gap-2">
                    <MessageSquare
                        size={14}
                        className="text-gray-300 shrink-0 mt-0.5"
                    />
                    {r.comentario}
                </p>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900 font-bold whitespace-nowrap">
                <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <Calendar size={12} />
                    {r.fecha}
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => deleteReview(r.id)}
                        className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 shadow-sm transition-all"
                        title="Eliminar Reseña"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Moderación de Reseñas" activeItem="Reseñas">
            <Head title="Reseñas - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                    Comentarios de Clientes
                </h2>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.reviews"
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
                            className={`px-3 py-1 rounded text-sm border font-bold ${
                                link.active
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                            } ${!link.url ? "opacity-40 pointer-events-none" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </PanelLayout>
    );
}

import React, { useState } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import AdminModal from "@/Components/PanelAdminEcommerce/AdminModal";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { User, TrendingDown, CreditCard, Calendar, Eye, Edit2 } from "lucide-react";
import { useAdminRoutes } from "@/Utils/adminRoutes";

const estadoBadge = (estado) => {
    const map = {
        pendiente: "bg-orange-50 text-orange-700 border-orange-200",
        procesado: "bg-green-50 text-green-700 border-green-200",
        rechazado: "bg-red-50 text-red-700 border-red-200",
    };
    return map[estado] ?? "bg-gray-100 text-gray-700 border-gray-200";
};

export default function Retiros({ retiros, filters = {}, admins = [] }) {
    const { data = [], links = [] } = retiros ?? {};
    const { routeUrl } = useAdminRoutes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRetiro, setEditingRetiro] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const {
        data: formData,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        id_retiro: "",
        estado: "",
        metodo: "",
        notas_admin: "",
        id_procesado_por: "",
    });

    const filtersConfig = [
        {
            name: "estado",
            label: "Estado",
            type: "select",
            options: [
                { value: "pendiente", label: "Pendiente" },
                { value: "procesado", label: "Procesado" },
                { value: "rechazado", label: "Rechazado" },
            ],
        },
        { name: "monto_min", label: "Monto Mínimo", type: "number" },
    ];

    const columns = [
        { label: "Usuario", key: "usuario", sortable: false },
        { label: "Monto", key: "monto", sortable: true, align: "right" },
        { label: "Método", key: "metodo", sortable: false },
        { label: "Estado", key: "estado", sortable: true, align: "center" },
        { label: "Fecha Solicitud", key: "fecha_solicitud", sortable: true },
        { label: "Acciones", key: "acciones", sortable: false, align: "right" },
    ];

    const openDetails = (retiro, readOnly = true) => {
        setEditingRetiro(retiro);
        setIsReadOnly(readOnly);
        setData({
            id_retiro: retiro.id,
            estado: retiro.estado || "pendiente",
            metodo: retiro.metodo || "",
            notas_admin: retiro.notas_admin || "",
            id_procesado_por: retiro.id_procesado_por || "",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(routeUrl("panel.ecommerce.finanzas.retiros.update", formData.id_retiro), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleSort = (key) => {
        let newDir = "asc";
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === "asc" ? "desc" : "asc";
        }
        router.get(
            routeUrl("panel.ecommerce.finanzas.retiros"),
            {
                ...filters,
                sort_by: key,
                sort_dir: newDir,
            },
            { preserveState: true, replace: true },
        );
    };

    const renderRow = (retiro) => (
        <tr
            key={retiro.id}
            className="hover:bg-gray-50 transition-colors group cursor-pointer"
            onClick={() => openDetails(retiro, true)}
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                            {retiro.usuario}
                        </span>
                        <span className="text-xs text-gray-400">
                            {retiro.email}
                        </span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-right font-black text-black">
                <div className="flex items-center justify-end gap-1">
                    <TrendingDown size={14} className="text-red-500" />€
                    {Number(retiro.monto).toFixed(2)}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                        {retiro.metodo}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${estadoBadge(retiro.estado)}`}
                >
                    {retiro.estado}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <Calendar size={12} />
                    {retiro.fecha_solicitud}
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetails(retiro, true);
                        }}
                        className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 shadow-sm transition-all"
                        title="Ver Detalles"
                    >
                        <Eye size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetails(retiro, false);
                        }}
                        className="p-2 bg-white text-gray-400 hover:text-amber-600 rounded-lg border border-gray-200 hover:border-amber-200 shadow-sm transition-all"
                        title="Gestionar"
                    >
                        <Edit2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Gestión de Retiros" activeItem="Retiros">
            <Head title="Retiros - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">
                    Solicitudes de Retiro
                </h2>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.finanzas.retiros"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
            />

            {/* Pagination */}
            {links.length > 3 && (
                <div className="flex justify-center gap-1 mt-6">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? "#"}
                            className={`px-3 py-1 rounded text-sm border ${link.active
                                ? "bg-red-600 text-white border-red-600"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                } ${!link.url ? "opacity-40 pointer-events-none" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Detalles / Edición */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    isReadOnly ? "Detalles de Retiro" : "Gestionar Solicitud"
                }
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                                    Monto a Retirar
                                </label>
                                <p className="text-xl font-black text-black">
                                    €
                                    {Number(editingRetiro?.monto || 0).toFixed(
                                        2,
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                                    Método
                                </label>
                                <p className="text-sm font-bold text-gray-700 capitalize">
                                    {editingRetiro?.metodo}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                                Estado de la Solicitud
                            </label>
                            <select
                                disabled={isReadOnly}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                                value={formData.estado}
                                onChange={(e) =>
                                    setData("estado", e.target.value)
                                }
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="procesado">Procesado</option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                                Procesado Por
                            </label>
                            <select
                                disabled={isReadOnly}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                                value={formData.id_procesado_por}
                                onChange={(e) =>
                                    setData("id_procesado_por", e.target.value)
                                }
                            >
                                <option value="">— Sin Asignar —</option>
                                {admins.map((admin) => (
                                    <option key={admin.id} value={admin.id}>
                                        {admin.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Notas Administrativas
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full p-3 bg-white border rounded-xl outline-none text-black focus:ring-2 focus:ring-red-500 min-h-[100px] ${isReadOnly ? "border-transparent bg-gray-50" : "border-gray-200"}`}
                            rows="4"
                            value={formData.notas_admin}
                            onChange={(e) =>
                                setData("notas_admin", e.target.value)
                            }
                            placeholder="Añade notas sobre el proceso, motivo de rechazo, etc..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-xs font-black text-gray-400 uppercase hover:bg-gray-50 rounded-lg"
                        >
                            {isReadOnly ? "Cerrar" : "Cancelar"}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-red-600 text-white text-xs font-black uppercase rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-md shadow-red-200"
                            >
                                Guardar Cambios
                            </button>
                        )}
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}

import React, { useState } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import AdminModal from "@/Components/PanelAdminEcommerce/AdminModal";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { Plus, Eye, Edit2, Trash2, Truck, Search, Filter } from "lucide-react";

export default function Proveedores({ proveedores, filters = {} }) {
    const { data = [], links = [] } = proveedores ?? {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProveedor, setEditingProveedor] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const {
        data: formData,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        nombre: "",
        contacto_nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        notas: "",
        activo: true,
    });

    const filtersConfig = [
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "email", label: "Email", type: "text" },
        {
            name: "activo",
            label: "Estado",
            type: "select",
            options: [
                { value: "1", label: "Activo" },
                { value: "0", label: "Inactivo" },
            ],
        },
    ];

    const columns = [
        { label: "ID", key: "id", sortable: false, align: "right" },
        { label: "Nombre", key: "nombre", sortable: false },
        { label: "Contacto", key: "contacto_nombre", sortable: false },
        { label: "Email", key: "email", sortable: false },
        { label: "Registro", key: "fecha_registro", sortable: true },
        { label: "Estado", key: "activo", sortable: true, align: "center" },
        { label: "Acciones", key: "acciones", sortable: false, align: "right" },
    ];

    const handleSort = (key) => {
        let newDir = "asc";
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === "asc" ? "desc" : "asc";
        }
        router.get(
            route("panel.ecommerce.proveedores"),
            { ...filters, sort_by: key, sort_dir: newDir },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const openCreateModal = () => {
        setEditingProveedor(null);
        setIsReadOnly(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (prov) => {
        setEditingProveedor(prov);
        setIsReadOnly(false);
        setData({
            nombre: prov.nombre || "",
            contacto_nombre: prov.contacto_nombre || "",
            email: prov.email || "",
            telefono: prov.telefono || "",
            direccion: prov.direccion || "",
            notas: prov.notas || "",
            activo: !!prov.activo,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDetailsModal = (prov) => {
        setEditingProveedor(prov);
        setIsReadOnly(true);
        setData({
            nombre: prov.nombre || "",
            contacto_nombre: prov.contacto_nombre || "",
            email: prov.email || "",
            telefono: prov.telefono || "",
            direccion: prov.direccion || "",
            notas: prov.notas || "",
            activo: !!prov.activo,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProveedor) {
            put(
                route(
                    "panel.ecommerce.proveedores.update",
                    editingProveedor.id,
                ),
                {
                    onSuccess: () => setIsModalOpen(false),
                },
            );
        } else {
            post(route("panel.ecommerce.proveedores.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
            router.delete(route("panel.ecommerce.proveedores.destroy", id));
        }
    };

    const renderRow = (prov) => (
        <tr
            key={prov.id}
            className="hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/5"
            onClick={() => openDetailsModal(prov)}
        >
            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                #{prov.id}
            </td>
            <td className="px-6 py-4 font-black text-white italic font-['Outfit'] uppercase tracking-tight">
                {prov.nombre}
            </td>
            <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                {prov.contacto_nombre}
            </td>
            <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                {prov.email}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                {new Date(prov.fecha_registro).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-center">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${prov.activo ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                >
                    {prov.activo ? "Activo" : "Inactivo"}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-100 transition-all">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetailsModal(prov);
                        }}
                        className="p-2 bg-white/5 text-gray-600 hover:text-white rounded-lg border border-white/5 hover:border-white/20 transition-all shadow-xl"
                        title="Ver Detalles"
                    >
                        <Eye size={14} className="hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(prov);
                        }}
                        className="p-2 bg-white/5 text-gray-600 hover:text-amber-400 rounded-lg border border-white/5 hover:border-amber-500/20 transition-all shadow-xl"
                        title="Editar"
                    >
                        <Edit2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(prov.id);
                        }}
                        className="p-2 bg-white/5 text-gray-600 hover:text-red-500 rounded-lg border border-white/5 hover:border-red-500/20 transition-all shadow-xl"
                        title="Eliminar"
                    >
                        <Trash2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Gestión de Proveedores" activeItem="Proveedores">
            <Head title="Proveedores - Admin Panel" />

            <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase italic font-['Outfit']">
                    Listado de Proveedores
                </h2>
                <button
                    onClick={openCreateModal}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:from-red-500 hover:to-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all flex items-center gap-2 italic font-['Outfit'] active:scale-95"
                >
                    <Plus size={16} /> Nuevo Proveedor
                </button>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.proveedores"
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
                <div className="flex justify-center gap-2 mt-10">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? "#"}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${link.active
                                ? "bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                                : "bg-white/5 text-gray-500 border-white/5 hover:text-white hover:bg-white/10"
                                } ${!link.url ? "opacity-20 pointer-events-none" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    isReadOnly
                        ? "Detalles del Proveedor"
                        : editingProveedor
                            ? "Editar Proveedor"
                            : "Nuevo Proveedor"
                }
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">
                                Nombre Empresa
                            </label>
                            <input
                                type="text"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none font-bold text-gray-900 ${isReadOnly ? "bg-gray-50 border-gray-100" : errors.nombre ? "border-red-500" : "border-gray-300"}`}
                                value={formData.nombre}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                            />
                            {errors.nombre && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">
                                Nombre Contacto
                            </label>
                            <input
                                type="text"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? "bg-gray-50 border-gray-100" : "border-gray-300"}`}
                                value={formData.contacto_nombre}
                                onChange={(e) =>
                                    setData("contacto_nombre", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">
                                Email
                            </label>
                            <input
                                type="email"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? "bg-gray-50 border-gray-100" : errors.email ? "border-red-500" : "border-gray-300"}`}
                                value={formData.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                readOnly={isReadOnly}
                                className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? "bg-gray-50 border-gray-100" : "border-gray-300"}`}
                                value={formData.telefono}
                                onChange={(e) =>
                                    setData("telefono", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">
                            Dirección
                        </label>
                        <input
                            type="text"
                            readOnly={isReadOnly}
                            className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? "bg-gray-50 border-gray-100" : "border-gray-300"}`}
                            value={formData.direccion}
                            onChange={(e) =>
                                setData("direccion", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-black text-black mb-1 uppercase tracking-tight">
                            Notas Internas
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className={`w-full p-2 border rounded-lg outline-none text-gray-900 ${isReadOnly ? "bg-gray-50 border-gray-100" : "border-gray-300"}`}
                            rows="3"
                            value={formData.notas}
                            onChange={(e) => setData("notas", e.target.value)}
                        ></textarea>
                    </div>

                    {!isReadOnly && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="p_activo"
                                checked={formData.activo}
                                onChange={(e) =>
                                    setData("activo", e.target.checked)
                                }
                            />
                            <label
                                htmlFor="p_activo"
                                className="text-sm font-bold text-black uppercase"
                            >
                                Proveedor Activo
                            </label>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            {isReadOnly ? "Cerrar" : "Cancelar"}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-red-600 text-white text-sm font-black rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-md"
                            >
                                {editingProveedor
                                    ? "Guardar Cambios"
                                    : "Crear Proveedor"}
                            </button>
                        )}
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}

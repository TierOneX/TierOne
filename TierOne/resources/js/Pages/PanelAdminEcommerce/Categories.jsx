import React, { useState } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import AdminModal from "@/Components/PanelAdminEcommerce/AdminModal";
import { Head, useForm, router, Link } from "@inertiajs/react";
import {
    Plus,
    Eye,
    Edit2,
    Trash2,
    CornerDownRight,
    Tag,
    Search,
    Filter,
} from "lucide-react";

export default function Categories({
    categorias = [],
    filters = {},
    todas_categorias = [],
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            nombre: "",
            slug: "",
            descripcion: "",
            id_parent: "",
            activa: true,
        });

    const filtersConfig = [
        { name: "nombre", label: "Nombre", type: "text" },
        {
            name: "activa",
            label: "Estado",
            type: "select",
            options: [
                { value: "1", label: "Activa" },
                { value: "0", label: "Inactiva" },
            ],
        },
    ];

    const columns = [
        { label: "Nombre", key: "nombre", sortable: true },
        { label: "Slug", key: "slug", sortable: false },
        { label: "Descripción", key: "descripcion", sortable: false },
        {
            label: "Subcategorías",
            key: "subcategorias",
            sortable: false,
            align: "center",
        },
        { label: "Estado", key: "activa", sortable: true, align: "center" },
        { label: "Acciones", key: "acciones", sortable: false, align: "right" },
    ];

    const openCreateModal = () => {
        setEditingCategory(null);
        setIsReadOnly(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setIsReadOnly(false);
        setData({
            nombre: cat.nombre || "",
            slug: cat.slug || "",
            descripcion: cat.descripcion || "",
            id_parent: cat.padre || "",
            activa: !!cat.activa,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDetailsModal = (cat) => {
        setEditingCategory(cat);
        setIsReadOnly(true);
        setData({
            nombre: cat.nombre || "",
            slug: cat.slug || "",
            descripcion: cat.descripcion || "",
            id_parent: cat.padre || "",
            activa: !!cat.activa,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(
                route("panel.ecommerce.categories.update", editingCategory.id),
                {
                    onSuccess: () => setIsModalOpen(false),
                },
            );
        } else {
            post(route("panel.ecommerce.categories.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
            router.delete(route("panel.ecommerce.categories.destroy", id));
        }
    };

    const handleSort = (key) => {
        let newDir = "asc";
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === "asc" ? "desc" : "asc";
        }
        router.get(
            route("panel.ecommerce.categories"),
            {
                ...filters,
                sort_by: key,
                sort_dir: newDir,
            },
            { preserveState: true, replace: true },
        );
    };

    const renderRow = (cat) => (
        <tr
            key={cat.id}
            className="hover:bg-gray-50 transition-colors group cursor-pointer"
            onClick={() => openDetailsModal(cat)}
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {cat.padre && (
                        <CornerDownRight size={12} className="text-gray-300" />
                    )}
                    <span className="font-bold text-gray-900">
                        {cat.nombre}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-xs text-gray-400 font-mono italic tracking-tight">
                {cat.slug}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {cat.descripcion ?? "—"}
            </td>
            <td className="px-6 py-4 text-center">
                {cat.subcategorias > 0 ? (
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {cat.subcategorias}
                    </span>
                ) : (
                    <span className="text-gray-300">—</span>
                )}
            </td>
            <td className="px-6 py-4 text-center">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${cat.activa ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                >
                    {cat.activa ? "Activa" : "Inactiva"}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetailsModal(cat);
                        }}
                        className="p-2 bg-gray-50 text-gray-600 hover:text-blue-600 rounded-lg border border-gray-200 hover:border-blue-200 shadow-sm transition-all"
                        title="Ver Detalles"
                    >
                        <Eye size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(cat);
                        }}
                        className="p-2 bg-gray-50 text-gray-600 hover:text-amber-600 rounded-lg border border-gray-200 hover:border-amber-200 shadow-sm transition-all"
                        title="Editar"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat.id);
                        }}
                        className="p-2 bg-gray-50 text-gray-600 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 shadow-sm transition-all"
                        title="Eliminar"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Gestión de Categorías" activeItem="Categorías">
            <Head title="Categorías - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                    Listado de Categorías
                </h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 tracking-widest flex items-center gap-2"
                >
                    <Plus size={14} /> Nueva Categoría
                </button>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.categories"
            />

            <AdminTable
                columns={columns}
                data={categorias}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
                emptyMessage="No se encontraron categorías."
            />

            {/* Modal de Creación/Edición/Detalles */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    isReadOnly
                        ? "Detalles de Categoría"
                        : editingCategory
                            ? "Editar Categoría"
                            : "Nueva Categoría"
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Nombre
                        </label>
                        <input
                            type="text"
                            readOnly={isReadOnly}
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "border-gray-100 bg-gray-100" : errors.nombre ? "border-red-500" : "border-gray-200"}`}
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            placeholder="Ej: Camisetas"
                        />
                        {errors.nombre && (
                            <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Slug (URL)
                        </label>
                        <input
                            type="text"
                            readOnly={isReadOnly}
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none text-black font-mono text-xs focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "border-gray-100 bg-gray-100" : errors.slug ? "border-red-500" : "border-gray-200"}`}
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                            placeholder="Dejar vacío para auto-generar"
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">
                                {errors.slug}
                            </p>
                        )}
                        {!isReadOnly && (
                            <p className="text-[9px] text-gray-400 mt-1 italic">
                                Ej: mi-categoria-personalizada
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Categoría Padre (Opcional)
                        </label>
                        <select
                            disabled={isReadOnly}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            value={data.id_parent}
                            onChange={(e) =>
                                setData("id_parent", e.target.value)
                            }
                        >
                            <option value="">
                                — Ninguna (Categoría Principal) —
                            </option>
                            {todas_categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Descripción
                        </label>
                        <textarea
                            readOnly={isReadOnly}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            rows="3"
                            value={data.descripcion}
                            onChange={(e) =>
                                setData("descripcion", e.target.value)
                            }
                            placeholder="Descripción de la categoría..."
                        ></textarea>
                    </div>

                    {!isReadOnly && (
                        <div className="flex items-center gap-2 py-2">
                            <input
                                type="checkbox"
                                id="activa"
                                className="w-4 h-4 bg-white border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                checked={data.activa}
                                onChange={(e) =>
                                    setData("activa", e.target.checked)
                                }
                            />
                            <label
                                htmlFor="activa"
                                className="text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer"
                            >
                                Estado Activo
                            </label>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-xs font-black text-gray-400 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            {isReadOnly ? "Cerrar" : "Cancelar"}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md shadow-blue-200"
                            >
                                {editingCategory
                                    ? "Guardar Cambios"
                                    : "Crear Categoría"}
                            </button>
                        )}
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}

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

    // Función para ordenar jerárquicamente: Padre -> Sus Hijos -> Siguiente Padre
    const sortHierarchically = (items) => {
        if (!Array.isArray(items)) return [];
        
        // Categorías principales (sin padre)
        const parents = items
            .filter((cat) => !cat.padre)
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        // Subcategorías (con padre)
        const children = items.filter((cat) => cat.padre);

        const sorted = [];
        parents.forEach((parent) => {
            sorted.push(parent);
            // Buscamos los hijos directos de este padre
            const subcategories = children
                .filter((sub) => sub.padre === parent.id)
                .sort((a, b) => a.nombre.localeCompare(b.nombre));
            sorted.push(...subcategories);
        });

        // Añadir huérfanas si existieran (subcategorías cuyo padre no está en la lista actual)
        const orphans = children.filter(
            (sub) => !parents.find((p) => p.id === sub.padre)
        ).sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        sorted.push(...orphans);

        return sorted;
    };

    const sortedCategories = sortHierarchically(categorias);

    const renderRow = (cat) => (
        <tr
            key={cat.id}
            className="hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/5"
            onClick={() => openDetailsModal(cat)}
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {cat.padre ? (
                        <div className="flex items-center gap-2 ml-4">
                            <CornerDownRight size={14} className="text-red-500/50" />
                            <span className="font-bold text-gray-400 text-sm italic font-['Outfit'] uppercase tracking-tight">
                                {cat.nombre}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600/10 rounded-lg text-red-500 border border-red-500/20">
                                <Tag size={14} />
                            </div>
                            <span className="font-black text-white text-sm italic font-['Outfit'] uppercase tracking-widest">
                                {cat.nombre}
                            </span>
                        </div>
                    )}
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
                    <span className="bg-red-600/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {cat.subcategorias} Subs
                    </span>
                ) : (
                    <span className="text-gray-700 font-mono">—</span>
                )}
            </td>
            <td className="px-6 py-4 text-center">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-tighter ${cat.activa ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                >
                    {cat.activa ? "Activa" : "Inactiva"}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-100 transition-all">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetailsModal(cat);
                        }}
                        className="p-2 bg-white/5 text-gray-600 hover:text-white rounded-lg border border-white/5 hover:border-white/20 transition-all"
                        title="Ver Detalles"
                    >
                        <Eye size={14} className="hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(cat);
                        }}
                        className="p-2 bg-white/5 text-gray-600 hover:text-amber-500 rounded-lg border border-white/5 hover:border-amber-500/20 transition-all"
                        title="Editar"
                    >
                        <Edit2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat.id);
                        }}
                        className="p-2 bg-white/5 text-gray-600 hover:text-red-500 rounded-lg border border-white/5 hover:border-red-500/20 transition-all"
                        title="Eliminar"
                    >
                        <Trash2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <PanelLayout title="Gestión de Categorías" activeItem="Categorías">
            <Head title="Categorías - Admin Panel" />

            <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase italic font-['Outfit']">
                    Listado de Categorías
                </h2>
                <button
                    onClick={openCreateModal}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:from-red-500 hover:to-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all flex items-center gap-2 italic font-['Outfit'] active:scale-95"
                >
                    <Plus size={16} /> Nueva Categoría
                </button>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.categories"
            />

            <AdminTable
                columns={columns}
                data={sortedCategories}
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
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-red-500 ${isReadOnly ? "border-gray-100 bg-gray-100" : errors.nombre ? "border-red-500" : "border-gray-200"}`}
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
                            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none text-black font-mono text-xs focus:ring-2 focus:ring-red-500 ${isReadOnly ? "border-gray-100 bg-gray-100" : errors.slug ? "border-red-500" : "border-gray-200"}`}
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
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-red-500 disabled:opacity-50"
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
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black focus:ring-2 focus:ring-red-500 min-h-[100px]"
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
                                className="w-4 h-4 bg-white border-gray-300 rounded text-red-600 focus:ring-red-500"
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
                                className="px-6 py-2 bg-red-600 text-white text-xs font-black uppercase rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md shadow-red-200"
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

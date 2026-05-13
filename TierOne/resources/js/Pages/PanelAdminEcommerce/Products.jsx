import React, { useState, useEffect } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import AdminModal from "@/Components/PanelAdminEcommerce/AdminModal";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { useAdminRoutes } from "@/Utils/adminRoutes";
import {
    Plus,
    Eye,
    Edit2,
    Trash2,
    ChevronRight,
    ChevronDown,
    Package,
    ImagePlus,
    X,
    FolderOpen,
    Search,
    Filter,
    Layers,
} from "lucide-react";

export default function Products({
    productos,
    categorias = [],
    proveedores = [],
    filters = {},
}) {
    const { data = [], links = [] } = productos ?? {};
    const { routeUrl } = useAdminRoutes();
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.startsWith('data:')) return path; 
        return `/${path.replace(/^\//, '')}`;
    };

    const filtersConfig = [
        { name: "search", label: "Buscar", type: "text" },
        {
            name: "id_categoria",
            label: "Categoría",
            type: "select",
            options: [
                { value: "", label: "Todas" },
                ...categorias.map((c) => ({ value: c.id, label: c.nombre })),
            ],
        },
        {
            name: "destacado",
            label: "Destacado",
            type: "select",
            options: [
                { value: "", label: "Cualquiera" },
                { value: "1", label: "Sí" },
                { value: "0", label: "No" },
            ],
        },
    ];

    const columns = [
        { label: "Producto", key: "nombre", sortable: true },
        {
            label: "P. Coste",
            key: "precio_proveedor",
            sortable: true,
            align: "right",
        },
        {
            label: "P. Venta",
            key: "precio_venta",
            sortable: true,
            align: "right",
        },
        {
            label: "Ventas",
            key: "ventas_totales",
            sortable: true,
            align: "right",
        },
        { label: "Estado", key: "activo", sortable: true, align: "center" },
        { label: "Acciones", key: "acciones", sortable: false, align: "right" },
    ];

    const handleSort = (key) => {
        let newDir = "asc";
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === "asc" ? "desc" : "asc";
        }

        router.get(
            routeUrl("panel.ecommerce.products"),
            {
                ...filters,
                sort_by: key,
                sort_dir: newDir,
            },
            { preserveState: true, replace: true },
        );
    };

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
        id_categoria: "",
        id_proveedor: "",
        precio_venta: "",
        precio_proveedor: "",
        activo: true,
        destacado: false,
        personalizable: false,
        descripcion: "",
        imagen_principal: "",
        imagen_archivo: null,
    });

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedProduct(null);
        setImagePreview(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode("edit");
        setSelectedProduct(product);
        setImagePreview(product.imagen_principal || null);
        setData({
            nombre: product.nombre || "",
            id_categoria: product.categoria?.id || "",
            id_proveedor: product.proveedor?.id || "",
            precio_venta: product.precio_venta || "",
            precio_proveedor: product.precio_proveedor || "",
            activo: !!product.activo,
            destacado: !!product.destacado,
            personalizable: !!product.personalizable,
            descripcion: product.descripcion || "",
            imagen_principal: product.imagen_principal || "",
            imagen_archivo: null,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openViewModal = (product) => {
        setModalMode("view");
        setSelectedProduct(product);
        setImagePreview(product.imagen_principal || null);
        setData({
            nombre: product.nombre || "",
            id_categoria: product.categoria?.id || "",
            id_proveedor: product.proveedor?.id || "",
            precio_venta: product.precio_venta || "",
            precio_proveedor: product.precio_proveedor || "",
            activo: !!product.activo,
            destacado: !!product.destacado,
            personalizable: !!product.personalizable,
            descripcion: product.descripcion || "",
            imagen_principal: product.imagen_principal || "",
            imagen_archivo: null,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === "create") {
            post(routeUrl("panel.ecommerce.products.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setImagePreview(null);
                },
            });
        } else if (modalMode === "edit") {
            // Usamos post con _method: put para soportar subida de archivos en actualización
            router.post(
                routeUrl("panel.ecommerce.products.update", selectedProduct.id),
                {
                    ...formData,
                    _method: "put",
                },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                },
            );
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("imagen_archivo", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = (id) => {
        if (
            confirm(
                "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.",
            )
        ) {
            router.delete(routeUrl("panel.ecommerce.products.destroy", id));
        }
    };

    const renderRow = (product) => (
        <React.Fragment key={product.id}>
            <tr
                className="hover:bg-white/5 transition-colors group border-b border-white/5 cursor-pointer"
                onClick={() => openViewModal(product)}
            >
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProduct(
                                    expandedProduct === product.id
                                        ? null
                                        : product.id,
                                );
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors w-4"
                        >
                            {expandedProduct === product.id ? (
                                <ChevronDown size={14} />
                            ) : (
                                <ChevronRight size={14} />
                            )}
                        </button>
                        {product.imagen_principal ? (
                            <img
                                src={getImageUrl(product.imagen_principal)}
                                alt={product.nombre}
                                className="w-10 h-10 rounded-lg object-cover border border-white/10 shadow-lg group-hover:scale-110 transition-transform"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-gray-500 border border-white/5">
                                <Package size={16} />
                            </div>
                        )}
                        <div>
                            <p className="font-black text-white text-sm uppercase tracking-tight italic font-['Outfit']">
                                {product.nombre}
                            </p>
                            <div className="flex gap-1 mt-1">
                                <span className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/10 uppercase font-black tracking-tighter">
                                    {product.categoria?.nombre || "General"}
                                </span>
                                {product.variantes?.length > 0 && (
                                    <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-black tracking-tighter">
                                        {product.variantes.length} Variantes
                                    </span>
                                )}
                                {product.personalizable && (
                                    <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 uppercase font-black tracking-tighter">
                                        Personalizable
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-400 text-right italic font-mono">
                    €{Number(product.precio_proveedor).toFixed(2)}
                </td>
                <td className="px-6 py-4 font-black text-white text-right italic font-mono">
                    €{Number(product.precio_venta).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-right font-mono">
                    {product.ventas_totales}
                </td>
                <td className="px-6 py-4 text-center">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${product.activo ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                    >
                        {product.activo ? "Activo" : "Pausado"}
                    </span>
                </td>
                <td
                    className="px-6 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-end gap-2 opacity-100 transition-all">
                        <button
                            onClick={() => openViewModal(product)}
                            className="p-2 bg-white/5 text-gray-600 hover:text-white rounded-lg border border-white/5 hover:border-white/20 transition-all"
                            title="Ver Detalles"
                        >
                            <Eye size={14} className="hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                        </button>
                        <button
                            onClick={() => openEditModal(product)}
                            className="p-2 bg-white/5 text-gray-600 hover:text-amber-500 rounded-lg border border-white/5 hover:border-amber-500/20 transition-all"
                            title="Editar"
                        >
                            <Edit2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        </button>
                        {product.personalizable && (
                            <Link
                                href={routeUrl('panel.ecommerce.products.zonas', product.id)}
                                className="p-2 bg-white/5 text-gray-600 hover:text-purple-500 rounded-lg border border-white/5 hover:border-purple-500/20 transition-all"
                                title="Configurar Zonas"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Layers size={14} className="hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                            </Link>
                        )}
                        <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-white/5 text-gray-600 hover:text-red-500 rounded-lg border border-white/5 hover:border-red-500/20 transition-all"
                            title="Eliminar"
                        >
                            <Trash2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Fila expandida para Variantes */}
            {expandedProduct === product.id && (
                <tr className="bg-gray-50/50">
                    <td colSpan={6} className="px-12 py-6">
                        <div className="border-l-2 border-red-500/30 pl-6 py-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Variantes Disponibles
                                </h3>
                                <button className="text-[10px] font-black text-red-500 hover:text-white uppercase tracking-widest bg-red-600/10 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-600 transition-all flex items-center gap-2">
                                    <Plus size={12} /> Añadir Variante
                                </button>
                            </div>
                            {product.variantes?.length === 0 ? (
                                <p className="text-sm text-gray-400 italic font-medium">
                                    Este producto no tiene variantes
                                    registradas.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {product.variantes.map((v) => (
                                        <div
                                            key={v.id}
                                            className="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 shadow-xl flex flex-col justify-between group/v transition-all hover:border-red-500/30"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-black text-white text-sm uppercase tracking-tight italic font-['Outfit']">
                                                        {v.nombre}
                                                    </p>
                                                    <p className="text-[9px] font-mono text-gray-400 uppercase mt-0.5">
                                                        {v.sku || "SIN SKU"}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-[9px] px-1.5 py-0.5 rounded font-black border tracking-tighter ${v.disponible ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}
                                                >
                                                    {v.disponible
                                                        ? "DISPONIBLE"
                                                        : "AGOTADO"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 border-t border-gray-50 pt-3">
                                                <span className="text-sm font-black text-red-600">
                                                    €
                                                    {Number(v.precio).toFixed(
                                                        2,
                                                    )}
                                                </span>
                                                <div className="flex gap-1 opacity-0 group-hover/v:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-gray-400 hover:text-black transition-colors">
                                                        <Edit2 size={12} />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );

    return (
        <PanelLayout title="Gestión de Productos" activeItem="Productos">
            <Head title="Productos - Admin Panel" />

            <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase italic font-['Outfit']">
                    Listado de Productos
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:from-red-500 hover:to-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all flex items-center gap-2 italic font-['Outfit'] active:scale-95"
                    >
                        <Plus size={16} /> Nuevo Producto
                    </button>
                </div>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.products"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
                emptyMessage="No se encontraron productos."
            />

            {/* Modal Único para CRUD */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    modalMode === "create"
                        ? "Nuevo Producto"
                        : modalMode === "edit"
                            ? "Editar Producto"
                            : "Detalles del Producto"
                }
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Nombre del Producto
                            </label>
                            <input
                                type="text"
                                readOnly={modalMode === "view"}
                                className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black font-bold transition-all ${errors.nombre ? "border-red-500" : "border-gray-200"} ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                                value={formData.nombre}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                placeholder="Ej: PlayStation 5 Slim"
                            />
                            {errors.nombre && (
                                <p className="text-red-500 text-[10px] mt-2 uppercase font-black tracking-widest">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div className="col-span-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
                                Categoría
                            </label>
                            <select
                                disabled={modalMode === "view"}
                                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black font-bold transition-all text-xs ${errors.id_categoria ? "border-red-500" : "border-gray-200"} ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                                value={formData.id_categoria}
                                onChange={(e) =>
                                    setData("id_categoria", e.target.value)
                                }
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.id_categoria && (
                                <p className="text-red-500 text-[9px] mt-1 uppercase font-black tracking-widest">
                                    {errors.id_categoria}
                                </p>
                            )}
                        </div>

                        <div className="col-span-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
                                Proveedor
                            </label>
                            <select
                                disabled={modalMode === "view"}
                                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black font-bold transition-all text-xs ${errors.id_proveedor ? "border-red-500" : "border-gray-200"} ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                                value={formData.id_proveedor}
                                onChange={(e) =>
                                    setData("id_proveedor", e.target.value)
                                }
                            >
                                <option value="">Seleccionar Proveedor</option>
                                {proveedores.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.id_proveedor && (
                                <p className="text-red-500 text-[9px] mt-1 uppercase font-black tracking-widest">
                                    {errors.id_proveedor}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
                                Imagen del Producto
                            </label>
                            <div className="grid grid-cols-2 gap-3 items-center">
                                <div className="space-y-2">
                                    <label
                                        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all ${modalMode === "view" ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:bg-gray-50 border-gray-200 hover:border-red-400"}`}
                                    >
                                        <div className="flex flex-col items-center justify-center py-2">
                                            <FolderOpen
                                                size={20}
                                                className="text-gray-400"
                                            />
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center px-2 truncate w-full mt-1">
                                                {formData.imagen_archivo
                                                    ? formData.imagen_archivo
                                                        .name
                                                    : "Subir archivo"}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            disabled={modalMode === "view"}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        readOnly={modalMode === "view"}
                                        className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black font-bold text-[10px] transition-all ${errors.imagen_principal ? "border-red-500" : "border-gray-200"}`}
                                        value={formData.imagen_principal}
                                        onChange={(e) =>
                                            setData(
                                                "imagen_principal",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="O URL de imagen"
                                    />
                                </div>
                                <div className="bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center h-full min-h-[140px] relative overflow-hidden">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-28 rounded-lg shadow-sm object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <ImagePlus
                                                size={24}
                                                className="text-gray-200"
                                            />
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                Sin vista previa
                                            </span>
                                        </div>
                                    )}
                                    {imagePreview && modalMode !== "view" && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setData("imagen_archivo", null);
                                                setData("imagen_principal", "");
                                            }}
                                            className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 border border-red-200 shadow-sm transition-transform hover:scale-110"
                                        >
                                            <X size={10} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {errors.imagen_archivo && (
                                <p className="text-red-500 text-[10px] mt-2 uppercase font-black tracking-widest">
                                    {errors.imagen_archivo}
                                </p>
                            )}
                            {errors.imagen_principal && (
                                <p className="text-red-500 text-[10px] mt-2 uppercase font-black tracking-widest">
                                    {errors.imagen_principal}
                                </p>
                            )}
                        </div>

                        <div className="col-span-1">
                            <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 h-full justify-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        disabled={modalMode === "view"}
                                        className="w-4 h-4 rounded border-gray-300 text-red-600"
                                        checked={formData.activo}
                                        onChange={(e) =>
                                            setData("activo", e.target.checked)
                                        }
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Activo
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        disabled={modalMode === "view"}
                                        className="w-4 h-4 rounded border-gray-300 text-amber-600"
                                        checked={formData.destacado}
                                        onChange={(e) =>
                                            setData(
                                                "destacado",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Destacado
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        disabled={modalMode === "view"}
                                        className="w-4 h-4 rounded border-gray-300 text-purple-600"
                                        checked={formData.personalizable}
                                        onChange={(e) =>
                                            setData(
                                                "personalizable",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Personalizable
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="col-span-1 space-y-2">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                    Precio Venta
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    readOnly={modalMode === "view"}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black font-black text-sm"
                                    value={formData.precio_venta}
                                    onChange={(e) =>
                                        setData("precio_venta", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                    Precio Coste
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    readOnly={modalMode === "view"}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-400 text-gray-500 font-bold text-xs"
                                    value={formData.precio_proveedor}
                                    onChange={(e) =>
                                        setData(
                                            "precio_proveedor",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
                                Descripción
                            </label>
                            <textarea
                                readOnly={modalMode === "view"}
                                className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black text-xs min-h-[80px] ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                                rows="2"
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setData("descripcion", e.target.value)
                                }
                                placeholder="Breve descripción..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
                        >
                            {modalMode === "view" ? "Cerrar" : "Cancelar"}
                        </button>
                        {modalMode !== "view" && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-red-700 shadow-md shadow-red-200 disabled:opacity-50 transition-all"
                            >
                                {processing
                                    ? "Procesando..."
                                    : modalMode === "create"
                                        ? "Crear Producto"
                                        : "Guardar Cambios"}
                            </button>
                        )}
                    </div>
                </form>
            </AdminModal>

            {/* Pagination */}
            {links.length > 3 && (
                <div className="flex justify-center gap-1 mt-8">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? "#"}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all border ${link.active
                                ? "bg-red-600 text-white border-red-500 shadow-sm"
                                : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-black"
                                } ${!link.url ? "opacity-30 pointer-events-none" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </PanelLayout>
    );
}

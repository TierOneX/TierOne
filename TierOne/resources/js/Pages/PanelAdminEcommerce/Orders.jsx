import React, { useState, useEffect } from "react";
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
    ChevronRight,
    ChevronDown,
    Package,
    Search,
    Filter,
} from "lucide-react";

const estadoBadge = (estado) => {
    const map = {
        pendiente: "bg-orange-50 text-orange-700 border-orange-200",
        procesando: "bg-red-50 text-red-700 border-red-200",
        enviada: "bg-purple-50 text-purple-700 border-purple-200",
        entregada: "bg-green-50 text-green-700 border-green-200",
        cancelada: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return map[estado] ?? "bg-gray-100 text-gray-800 border-gray-200";
};

export default function Orders({
    ordenes,
    usuarios = [],
    direcciones = [],
    filters = {},
}) {
    const { data = [], links = [] } = ordenes ?? {};
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view"); // 'create', 'view', 'edit'
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filtersConfig = [
        { name: "numero", label: "Número de Orden", type: "text" },
        { name: "cliente", label: "Cliente", type: "text" },
        {
            name: "estado",
            label: "Estado",
            type: "select",
            options: [
                { value: "pendiente", label: "Pendiente" },
                { value: "procesando", label: "Procesando" },
                { value: "enviada", label: "Enviada" },
                { value: "entregada", label: "Entregada" },
                { value: "cancelada", label: "Cancelada" },
            ],
        },
        { name: "fecha_desde", label: "Desde Fecha", type: "date" },
        { name: "fecha_hasta", label: "Hasta Fecha", type: "date" },
        { name: "total_min", label: "Monto Mínimo", type: "number" },
    ];

    const columns = [
        { label: "Orden", key: "numero", sortable: false },
        { label: "Fecha", key: "fecha", sortable: true },
        { label: "Cliente", key: "cliente", sortable: false },
        { label: "Estado", key: "estado", sortable: false, align: "center" },
        { label: "Tracking", key: "tracking", sortable: false },
        { label: "Total", key: "total", sortable: true, align: "right" },
        { label: "Acciones", key: "acciones", sortable: false, align: "right" },
    ];

    const handleSort = (key) => {
        let newDir = "asc";
        if (filters.sort_by === key) {
            newDir = filters.sort_dir === "asc" ? "desc" : "asc";
        }
        router.get(
            route("panel.ecommerce.orders"),
            { ...filters, sort_by: key, sort_dir: newDir },
            {
                preserveState: true,
                replace: true,
            },
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
        id_usuario: "",
        id_direccion_envio: "",
        // Manual address fields
        nombre_completo: "",
        direccion_linea1: "",
        ciudad: "",
        codigo_postal: "",
        pais: "",
        telefono: "",

        estado: "pendiente",
        subtotal: "",
        impuestos: "0",
        costo_envio: "0",
        descuento: "0",
        total: "",
        tracking_number: "",
        transportista: "",
    });

    const [isManualAddress, setIsManualAddress] = useState(false);

    const userAddresses = direcciones.filter(
        (d) => Number(d.id_usuario) === Number(formData.id_usuario),
    );

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedOrder(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openViewModal = (orden) => {
        setModalMode("view");
        setSelectedOrder(orden);
        setData({
            id_usuario: orden.id_usuario || "",
            id_direccion_envio: orden.id_direccion_envio || "",
            estado: orden.estado || "pendiente",
            subtotal: orden.subtotal || "",
            impuestos: orden.impuestos || "0",
            costo_envio: orden.costo_envio || "0",
            descuento: orden.descuento || "0",
            total: orden.total || "",
            tracking_number: orden.tracking || "",
            transportista: orden.transportista || "",
        });
        setIsManualAddress(false);
        setIsModalOpen(true);
    };

    const openEditModal = (orden) => {
        setModalMode("edit");
        setSelectedOrder(orden);
        setData({
            id_usuario: orden.id_usuario || "",
            id_direccion_envio: orden.id_direccion_envio || "",
            estado: orden.estado || "pendiente",
            subtotal: orden.subtotal || "",
            impuestos: orden.impuestos || "0",
            costo_envio: orden.costo_envio || "0",
            descuento: orden.descuento || "0",
            total: orden.total || "",
            tracking_number: orden.tracking || "",
            transportista: orden.transportista || "",
        });
        setIsManualAddress(false);
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === "create") {
            post(route("panel.ecommerce.orders.store"), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else if (modalMode === "edit") {
            put(route("panel.ecommerce.orders.update", selectedOrder.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (
            confirm(
                "¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.",
            )
        ) {
            router.delete(route("panel.ecommerce.orders.destroy", id));
        }
    };

    const renderRow = (orden) => (
        <React.Fragment key={orden.id}>
            <tr
                className="hover:bg-gray-50 transition-colors group cursor-pointer"
                onClick={() => openViewModal(orden)}
            >
                <td className="px-6 py-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedOrder(
                                    expandedOrder === orden.id
                                        ? null
                                        : orden.id,
                                );
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            {expandedOrder === orden.id ? (
                                <ChevronDown size={14} />
                            ) : (
                                <ChevronRight size={14} />
                            )}
                        </button>
                        #{orden.numero}
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    {orden.fecha}
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                            {orden.cliente}
                        </span>
                        <span className="text-xs text-gray-400">
                            {orden.email}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${estadoBadge(orden.estado)}`}
                    >
                        {orden.estado}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {orden.tracking ?? "—"}
                </td>
                <td className="px-6 py-4 text-right font-black text-black">
                    €{Number(orden.total).toFixed(2)}
                </td>
                <td
                    className="px-6 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => openViewModal(orden)}
                            className="p-2 bg-gray-50 text-gray-600 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 shadow-sm"
                            title="Ver detalles"
                        >
                            <Eye size={14} />
                        </button>
                        <button
                            onClick={() => openEditModal(orden)}
                            className="p-2 bg-gray-50 text-gray-600 hover:text-amber-600 rounded-lg border border-gray-200 hover:border-amber-200 shadow-sm"
                            title="Editar"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => handleDelete(orden.id)}
                            className="p-2 bg-gray-50 text-gray-600 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 shadow-sm"
                            title="Eliminar"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </td>
            </tr>
            {expandedOrder === orden.id && (
                <tr className="bg-gray-50/50">
                    <td colSpan={7} className="px-12 py-6">
                        <div className="border-l-2 border-red-500/30 pl-6 py-2">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em]">
                                Artículos del Pedido
                            </h4>
                            <div className="space-y-3">
                                {orden.items?.length > 0 ? (
                                    orden.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                                        >
                                            <div className="flex gap-4 items-center">
                                                <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-black text-red-600 text-[10px]">
                                                    x{item.cantidad}
                                                </span>
                                                <span className="text-gray-900 font-bold">
                                                    {item.producto}
                                                </span>
                                            </div>
                                            <div className="flex gap-8 items-center">
                                                <span className="text-gray-400 text-[10px] font-black uppercase">
                                                    €
                                                    {Number(
                                                        item.precio,
                                                    ).toFixed(2)}
                                                    /u
                                                </span>
                                                <span className="font-black text-gray-900">
                                                    €
                                                    {Number(
                                                        item.subtotal,
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic font-medium">
                                        No hay detalles disponibles para este
                                        pedido.
                                    </p>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );

    return (
        <PanelLayout title="Gestión de Órdenes" activeItem="Órdenes">
            <Head title="Órdenes - Admin Panel" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight uppercase">
                    Listado de Órdenes
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={openCreateModal}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-red-700 transition-colors shadow-md shadow-red-200 tracking-widest flex items-center gap-2"
                    >
                        <Plus size={14} /> Crear Pedido
                    </button>
                </div>
            </div>

            <FilterBar
                filtersConfig={filtersConfig}
                currentFilters={filters}
                routeName="panel.ecommerce.orders"
            />

            <AdminTable
                columns={columns}
                data={data}
                filters={filters}
                onSort={handleSort}
                renderRow={renderRow}
                emptyMessage="No se encontraron órdenes con estos filtros."
            />

            {/* Modal de CRUD para Órdenes */}
            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    modalMode === "create"
                        ? "Nueva Orden Manual"
                        : modalMode === "edit"
                            ? "Gestionar Pedido"
                            : "Detalles de la Orden"
                }
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div
                            className={
                                modalMode === "create" ? "col-span-2" : ""
                            }
                        >
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Cliente / Usuario
                            </label>
                            {modalMode === "create" ? (
                                <select
                                    className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black transition-all ${errors.id_usuario ? "border-red-500" : "border-gray-200"}`}
                                    value={formData.id_usuario}
                                    onChange={(e) =>
                                        setData("id_usuario", e.target.value)
                                    }
                                >
                                    <option value="">
                                        Seleccionar Usuario
                                    </option>
                                    {usuarios.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.nombre} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <p className="font-bold text-gray-900 text-sm">
                                        {selectedOrder?.cliente}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {selectedOrder?.email}
                                    </p>
                                </div>
                            )}
                            {errors.id_usuario && (
                                <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">
                                    {errors.id_usuario}
                                </p>
                            )}
                        </div>

                        {modalMode === "create" && formData.id_usuario && (
                            <div className="col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        Dirección de Envío
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsManualAddress(!isManualAddress)
                                        }
                                        className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline"
                                    >
                                        {isManualAddress
                                            ? "← Seleccionar existente"
                                            : "+ Introducir manual"}
                                    </button>
                                </div>
                                {!isManualAddress ? (
                                    <select
                                        className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black transition-all ${errors.id_direccion_envio ? "border-red-500" : "border-gray-200"}`}
                                        value={formData.id_direccion_envio}
                                        onChange={(e) =>
                                            setData(
                                                "id_direccion_envio",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Seleccionar Dirección Guardada
                                        </option>
                                        {userAddresses.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.nombre_completo} -{" "}
                                                {d.direccion_linea1} ({d.ciudad}
                                                )
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 p-4 bg-red-50/30 border border-red-100 rounded-xl">
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Nombre Completo"
                                                className="w-full bg-white border border-gray-100 p-3 rounded-lg text-sm"
                                                value={formData.nombre_completo}
                                                onChange={(e) =>
                                                    setData(
                                                        "nombre_completo",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Dirección"
                                                className="w-full bg-white border border-gray-100 p-3 rounded-lg text-sm"
                                                value={
                                                    formData.direccion_linea1
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "direccion_linea1",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Ciudad"
                                            className="bg-white border border-gray-100 p-3 rounded-lg text-sm"
                                            value={formData.ciudad}
                                            onChange={(e) =>
                                                setData(
                                                    "ciudad",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Código Postal"
                                            className="bg-white border border-gray-100 p-3 rounded-lg text-sm"
                                            value={formData.codigo_postal}
                                            onChange={(e) =>
                                                setData(
                                                    "codigo_postal",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="País"
                                            className="bg-white border border-gray-100 p-3 rounded-lg text-sm"
                                            value={formData.pais}
                                            onChange={(e) =>
                                                setData("pais", e.target.value)
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Teléfono"
                                            className="bg-white border border-gray-100 p-3 rounded-lg text-sm"
                                            value={formData.telefono}
                                            onChange={(e) =>
                                                setData(
                                                    "telefono",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                {errors.id_direccion_envio && (
                                    <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">
                                        {errors.id_direccion_envio}
                                    </p>
                                )}
                            </div>
                        )}

                        {modalMode !== "create" && (
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                    Número de Seguimiento
                                </label>
                                <input
                                    type="text"
                                    readOnly={modalMode === "view"}
                                    className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black transition-all border-gray-200 ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                                    value={formData.tracking_number}
                                    onChange={(e) =>
                                        setData(
                                            "tracking_number",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ej: TRACK123456"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Estado del Pedido
                            </label>
                            <select
                                disabled={modalMode === "view"}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black disabled:opacity-70 disabled:cursor-not-allowed"
                                value={formData.estado}
                                onChange={(e) =>
                                    setData("estado", e.target.value)
                                }
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="procesando">Procesando</option>
                                <option value="enviada">Enviada</option>
                                <option value="entregada">Entregada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>

                        {modalMode === "create" ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                        Subtotal (€)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black transition-all"
                                        value={formData.subtotal}
                                        onChange={(e) =>
                                            setData("subtotal", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                        Impuestos (€)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black transition-all"
                                        value={formData.impuestos}
                                        onChange={(e) =>
                                            setData("impuestos", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                        Costo Envío (€)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black transition-all"
                                        value={formData.costo_envio}
                                        onChange={(e) =>
                                            setData(
                                                "costo_envio",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                        Descuento (€)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-black transition-all"
                                        value={formData.descuento}
                                        onChange={(e) =>
                                            setData("descuento", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 font-black text-red-600">
                                        Total Final (€)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-6 bg-red-50 border border-red-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-black text-3xl text-red-900 transition-all"
                                        value={formData.total}
                                        onChange={(e) =>
                                            setData("total", e.target.value)
                                        }
                                    />
                                    {errors.total && (
                                        <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">
                                            {errors.total}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                    Total de la Orden (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    readOnly={modalMode === "view"}
                                    className={`w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-black text-lg transition-all ${errors.total ? "border-red-500" : "border-gray-200"} ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                                    value={formData.total}
                                    onChange={(e) =>
                                        setData("total", e.target.value)
                                    }
                                    placeholder="0.00"
                                />
                                {errors.total && (
                                    <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-widest">
                                        {errors.total}
                                    </p>
                                )}
                            </div>
                        )}

                        {modalMode === "view" &&
                            selectedOrder?.items?.length > 0 && (
                                <div className="col-span-2 mt-4">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                        Artículos Incluidos
                                    </label>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedOrder.items.map(
                                            (item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100"
                                                >
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {item.producto}{" "}
                                                        <span className="text-gray-400 font-black text-[10px] ml-1">
                                                            x{item.cantidad}
                                                        </span>
                                                    </span>
                                                    <span className="font-black text-black">
                                                        €
                                                        {Number(
                                                            item.subtotal,
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
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
                                        ? "Crear Orden"
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

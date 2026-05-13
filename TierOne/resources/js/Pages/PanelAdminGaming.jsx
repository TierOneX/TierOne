import { Head, router, usePage, Link } from "@inertiajs/react";
import React, { useMemo, useState } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import AdminModal from "@/Components/PanelAdminEcommerce/AdminModal";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";
import { useAdminRoutes } from "@/Utils/adminRoutes";
import { 
    Trophy, 
    Swords, 
    ShieldAlert, 
    UserCog, 
    Plus, 
    Edit2, 
    Trash2, 
    ExternalLink, 
    CheckCircle2, 
    Clock, 
    XCircle,
    Calendar,
    Users,
    Gamepad2,
    ChevronRight,
    ChevronDown,
    Search,
    Filter,
    LayoutGrid,
    Eye
} from "lucide-react";

const torneoStates = [
    { value: "inscripciones", label: "Inscripciones", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "en_curso", label: "En Curso", color: "bg-green-100 text-green-700 border-green-200" },
    { value: "finalizado", label: "Finalizado", color: "bg-gray-100 text-gray-700 border-gray-200" },
    { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-700 border-red-200" }
];

const torneoFormats = ["eliminacion_simple", "doble_eliminacion", "round_robin", "swiss"];
const partidaStates = ["pendiente", "en_proceso", "completada", "cancelada"];
const partidaTypes = ["1v1", "2v2", "5v5", "custom"];
const incidenciaStates = ["pendiente", "en_revision", "resuelta", "desestimada"];
const roles = ["player", "admin", "streamer"];

export default function PanelAdminGaming({
    filters = {},
    juegos = [],
    juegosFull = [],
    torneos = [],
    partidas = [],
    incidencias = [],
    cuentas = [],
}) {
    const { auth } = usePage().props;
    const { routeUrl } = useAdminRoutes();
    const activeSection = filters.section || "torneos";
    const [modal, setModal] = useState({ type: null, item: null });
    const [form, setForm] = useState({});
    const [expandedTorneo, setExpandedTorneo] = useState(null);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.startsWith('data:')) return path; 
        return `/${path.replace(/^\//, '')}`;
    };

    const menuItems = useMemo(
        () => [
            {
                title: "Gaming Core",
                items: [
                    { label: "Torneos", icon: "Trophy", link: routeUrl("panel.gaming.index", { section: "torneos", search: filters.search || "" }) },
                    { label: "Partidas", icon: "Swords", link: routeUrl("panel.gaming.index", { section: "partidas", search: filters.search || "" }) },
                    { label: "Juegos", icon: "Gamepad2", link: routeUrl("panel.gaming.index", { section: "juegos", search: filters.search || "" }) },
                ],
            },
            {
                title: "Moderacion",
                items: [
                    {
                        label: "Incidencias",
                        icon: "ShieldAlert",
                        link: routeUrl("panel.gaming.index", {
                            section: "incidencias",
                            search: filters.search || "",
                            incidencias_sort: filters.incidencias_sort || "newest",
                        }),
                    },
                    { label: "Cuentas", icon: "UserCog", link: routeUrl("panel.gaming.index", { section: "cuentas", search: filters.search || "" }) },
                ],
            },
        ],
        [filters.incidencias_sort, filters.search],
    );

    const openModal = (type, item = null) => {
        const initial = {
            estado: item?.estado ?? (type === "torneo-create" ? "inscripciones" : ""),
            max_participantes: item?.max_participantes ?? 2,
            tipo: item?.tipo ?? "1v1",
            resolucion: item?.resolucion ?? "",
            rol: item?.rol ?? "player",
            activo: Boolean(item?.activo ?? true),
            verificado: Boolean(item?.verificado ?? false),
            username: item?.username ?? "",
            email: item?.email ?? "",
            id_juego: item?.id_juego ?? juegos[0]?.id ?? "",
            nombre: item?.nombre ?? "",
            descripcion: item?.descripcion ?? "",
            imagen_banner: item?.imagen_banner ?? "",
            formato: item?.formato ?? "eliminacion_simple",
            cuota_inscripcion: item?.cuota_inscripcion ?? 0,
            premio_total: item?.premio_total ?? 0,
            comision_plataforma_porcentaje: item?.comision_plataforma_porcentaje ?? 10,
            es_gratuito: Boolean(item?.es_gratuito ?? false),
            fecha_inicio: formatDateTimeInput(item?.fecha_inicio),
            fecha_fin: formatDateTimeInput(item?.fecha_fin),
            cierre_inscripciones: formatDateTimeInput(item?.cierre_inscripciones),
            reglas_url: item?.reglas_url ?? "",
            stream_url: item?.stream_url ?? "",
            slug: item?.slug ?? "",
            categoria: item?.categoria ?? "",
            summary: item?.summary ?? "",
        };

        setModal({ type, item });
        setForm(initial);
    };

    const closeModal = () => {
        setModal({ type: null, item: null });
        setForm({});
    };

    const submitModal = (e) => {
        e.preventDefault();
        const id = modal.item?.id;

        if (modal.type === "torneo-create") {
            router.post(routeUrl("panel.gaming.torneos.store"), normalizeTorneoPayload(form), {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else if (modal.type === "torneo") {
            router.put(routeUrl("panel.gaming.torneos.update", id), normalizeTorneoPayload(form), {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else if (modal.type === "partida") {
            router.put(routeUrl("panel.gaming.partidas.update", id), form, { preserveScroll: true, onSuccess: closeModal });
        } else if (modal.type === "incidencia") {
            router.put(routeUrl("panel.gaming.incidencias.update", id), form, { preserveScroll: true, onSuccess: closeModal });
        } else if (modal.type === "cuenta") {
            router.put(routeUrl("panel.gaming.cuentas.update", id), form, { preserveScroll: true, onSuccess: closeModal });
        } else if (modal.type === "juego-create") {
            router.post(routeUrl("panel.gaming.juegos.store"), form, { preserveScroll: true, onSuccess: closeModal });
        } else if (modal.type === "juego") {
            router.put(routeUrl("panel.gaming.juegos.update", id), form, { preserveScroll: true, onSuccess: closeModal });
        }
    };

    const handleDelete = (id, type) => {
        if (confirm("¿Estás seguro de eliminar este registro?")) {
            let url = "";
            if (type === "torneo") url = routeUrl("panel.gaming.torneos.destroy", id);
            else if (type === "partida") url = routeUrl("panel.gaming.partidas.destroy", id);
            else if (type === "juego") url = routeUrl("panel.gaming.juegos.destroy", id);
            
            router.delete(url, { preserveScroll: true });
        }
    };

    const filtersConfig = useMemo(() => {
        const configs = {
            torneos: [
                { name: "search", label: "Buscar Torneo", type: "text" },
                {
                    name: "id_juego",
                    label: "Juego",
                    type: "select",
                    options: [
                        { value: "", label: "Todos los Juegos" },
                        ...juegos.map(j => ({ value: j.id, label: j.nombre }))
                    ]
                },
                {
                    name: "estado",
                    label: "Estado",
                    type: "select",
                    options: [
                        { value: "", label: "Cualquier Estado" },
                        ...torneoStates.map(s => ({ value: s.value, label: s.label }))
                    ]
                }
            ],
            partidas: [
                { name: "search", label: "Buscar Partida", type: "text" },
                {
                    name: "estado",
                    label: "Estado",
                    type: "select",
                    options: [
                        { value: "", label: "Cualquier Estado" },
                        ...partidaStates.map(s => ({ value: s, label: s.toUpperCase() }))
                    ]
                }
            ],
            juegos: [
                { name: "search", label: "Buscar Juego", type: "text" },
            ],
            default: [{ name: "search", label: "Buscar...", type: "text" }]
        };
        return configs[activeSection] || configs.default;
    }, [activeSection, juegos]);
    const activeLabel = activeSection === "partidas" ? "Partidas" : activeSection === "juegos" ? "Juegos" : activeSection === "incidencias" ? "Incidencias" : activeSection === "cuentas" ? "Cuentas" : "Torneos";

    return (
        <PanelLayout
            title="Panel Admin Gaming"
            activeItem={activeLabel}
            menuItems={menuItems}
            showGamingShortcut
            shortcutLink={routeUrl("panel.ecommerce.dashboard")}
            shortcutLabel="Administrar Ecommerce"
        >
            <Head title={`Admin Gaming: ${activeLabel}`} />

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase italic font-['Outfit']">
                        Gestión de {activeLabel}
                    </h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic opacity-70">
                        Ecosistema Gaming TierOne
                    </p>
                </div>
                {(activeSection === "torneos" || activeSection === "juegos") && (
                    <button 
                        onClick={() => openModal(activeSection === "torneos" ? "torneo-create" : "juego-create")} 
                        className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:from-red-500 hover:to-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all flex items-center gap-2 italic font-['Outfit'] active:scale-95"
                    >
                        <Plus size={16} /> {activeSection === "torneos" ? "Nuevo Torneo" : "Nuevo Juego"}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <FilterBar filtersConfig={filtersConfig} currentFilters={filters} routeName="panel.gaming.index" />

                {activeSection === "torneos" && (
                    <AdminTable
                        columns={[
                            { label: "Torneo / Juego", key: "nombre", sortable: true },
                            { label: "Organizador", key: "organizador", sortable: false },
                            { label: "Participación", key: "inscritos", align: "center", sortable: true },
                            { label: "Estado", key: "estado", align: "center", sortable: true },
                            { label: "Acciones", key: "acciones", align: "right", sortable: false },
                        ]}
                        data={torneos}
                        renderRow={(item) => {
                            const state = torneoStates.find(s => s.value === item.estado) || torneoStates[0];
                            const isExpanded = expandedTorneo === item.id;
                            return (
                                <React.Fragment key={item.id}>
                                    <tr className="hover:bg-white/5 transition-colors group border-b border-white/5 cursor-pointer" onClick={() => openModal("torneo", item)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedTorneo(isExpanded ? null : item.id);
                                                    }}
                                                    className="text-gray-400 hover:text-red-600 transition-colors w-4"
                                                >
                                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </button>
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/10 flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                                    {item.juego?.imagen_url ? (
                                                        <img src={getImageUrl(item.juego.imagen_url)} alt={item.juego.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                            <Gamepad2 size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-sm uppercase tracking-tight italic font-['Outfit']">{item.nombre}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.15em] italic">
                                                            {item.juego?.nombre || "Sin Juego"}
                                                        </span>
                                                        {item.verificado && (
                                                            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase font-black tracking-tighter">
                                                                Verificado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase">
                                                    {item.organizador?.username?.[0] || "?"}
                                                </div>
                                                <span className="text-sm font-bold text-gray-400 italic">{item.organizador?.username || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-black text-white italic font-mono">{item.inscripciones_count}/{item.max_participantes}</span>
                                                <div className="w-20 h-1 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                                                    <div 
                                                        className="h-full bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                                                        style={{ width: `${Math.min((item.inscripciones_count / item.max_participantes) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${state.value === 'en_curso' ? 'bg-green-500/10 text-green-400 border-green-500/20' : state.value === 'inscripciones' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                                {state.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2 opacity-100 transition-all">
                                                <button 
                                                    className="p-2 bg-white/5 text-gray-600 hover:text-white rounded-lg border border-white/5 hover:border-white/20 transition-all" 
                                                    onClick={(e) => { e.stopPropagation(); openModal("torneo", item); }}
                                                    title="Ver / Editar"
                                                >
                                                    <Eye size={14} className="hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                                                </button>
                                                <button 
                                                    className="p-2 bg-white/5 text-gray-600 hover:text-red-500 rounded-lg border border-white/5 hover:border-red-500/20 transition-all" 
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id, "torneo"); }}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {isExpanded && (
                                        <tr className="bg-white/[0.02]">
                                            <td colSpan={5} className="px-12 py-8 border-b border-white/5">
                                                <div className="border-l-2 border-red-600/30 pl-8 space-y-6">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Detalles de Competición</h4>
                                                        <div className="flex gap-4">
                                                            <div className="text-right">
                                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Premio Total</p>
                                                                <p className="text-sm font-black text-red-500 font-mono italic">€{Number(item.premio_total).toFixed(2)}</p>
                                                            </div>
                                                            <div className="text-right border-l border-white/10 pl-4">
                                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Cuota</p>
                                                                <p className="text-sm font-black text-white font-mono italic">{item.es_gratuito ? 'GRATIS' : `€${Number(item.cuota_inscripcion).toFixed(2)}`}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Fechas Clave</p>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-gray-400 font-bold uppercase italic">Inicio:</span>
                                                                    <span className="text-[10px] text-white font-mono">{new Date(item.fecha_inicio).toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-gray-400 font-bold uppercase italic">Cierre:</span>
                                                                    <span className="text-[10px] text-white font-mono">{new Date(item.cierre_inscripciones).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/5">
                                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Descripción / Reglas</p>
                                                            <p className="text-[10px] text-gray-400 leading-relaxed italic">{item.descripcion || 'Sin descripción detallada.'}</p>
                                                            {item.reglas_url && (
                                                                <a href={item.reglas_url} target="_blank" className="inline-flex items-center gap-2 mt-3 text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">
                                                                    <ExternalLink size={10} /> Ver Reglamento Completo
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        }}
                    />
                )}

                {activeSection === "partidas" && (
                    <AdminTable
                        columns={[
                            { label: "Partida / Modo", key: "titulo", sortable: true },
                            { label: "Creador", key: "creador", sortable: false },
                            { label: "Participantes", key: "participantes", align: "center", sortable: true },
                            { label: "Estado", key: "estado", align: "center", sortable: true },
                            { label: "Acciones", key: "acciones", align: "right", sortable: false },
                        ]}
                        data={partidas}
                        renderRow={(item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 text-red-500 rounded-lg border border-white/5">
                                            <Swords size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-sm uppercase tracking-tight italic font-['Outfit']">{item.titulo}</p>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{item.tipo} • {item.juego?.nombre}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-400 italic">{item.creador?.username || "-"}</td>
                                <td className="px-6 py-4 text-center font-mono text-sm text-white font-black italic">{item.participantes_count}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase border bg-white/5 text-gray-400 border-white/10 tracking-widest">
                                        {item.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2 opacity-100 transition-all">
                                        <button className="p-2 bg-white/5 text-gray-600 hover:text-amber-500 rounded-lg border border-white/5 hover:border-amber-500/20 transition-all" onClick={() => openModal("partida", item)} title="Editar">
                                            <Edit2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                        </button>
                                        <button className="p-2 bg-white/5 text-gray-600 hover:text-red-500 rounded-lg border border-white/5 hover:border-red-500/20 transition-all" onClick={() => handleDelete(item.id, "partida")} title="Eliminar">
                                            <Trash2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                )}

                {activeSection === "juegos" && (
                    <AdminTable
                        columns={[
                            { label: "Videojuego", key: "nombre", sortable: true },
                            { label: "Categoría", key: "categoria", sortable: true },
                            { label: "Estado", key: "activo", align: "center", sortable: true },
                            { label: "Acciones", key: "acciones", align: "right", sortable: false },
                        ]}
                        data={juegosFull}
                        renderRow={(item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/10 flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                            {item.imagen_url ? (
                                                <img src={getImageUrl(item.imagen_url)} alt={item.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <Gamepad2 size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-sm uppercase tracking-tight italic font-['Outfit']">{item.nombre}</p>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{item.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-400 italic uppercase tracking-widest text-xs">{item.categoria}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${item.activo ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                        {item.activo ? "Activo" : "Pausado"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2 opacity-100 transition-all">
                                        <button className="p-2 bg-white/5 text-gray-600 hover:text-amber-500 rounded-lg border border-white/5 hover:border-amber-500/20 transition-all" onClick={() => openModal("juego", item)} title="Editar">
                                            <Edit2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                        </button>
                                        <button className="p-2 bg-white/5 text-gray-600 hover:text-red-500 rounded-lg border border-white/5 hover:border-red-500/20 transition-all" onClick={() => handleDelete(item.id, "juego")} title="Eliminar">
                                            <Trash2 size={14} className="hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                )}

                {activeSection === "incidencias" && (
                    <AdminTable
                        columns={[
                            { label: "Tipo / Partida", key: "tipo", sortable: true },
                            { label: "Reportado por", key: "usuario", sortable: false },
                            { label: "Estado", key: "estado", align: "center", sortable: true },
                            { label: "Resolución", key: "resolucion", sortable: false },
                            { label: "Acciones", key: "acciones", align: "right", sortable: false },
                        ]}
                        data={incidencias}
                        renderRow={(item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-black text-white text-sm uppercase tracking-tight italic font-['Outfit']">{item.tipo}</p>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Partida: {item.partida?.titulo || "N/A"}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-400 italic">{item.usuario_reporta?.username || "-"}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                        item.estado === 'resuelta' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        item.estado === 'pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                    }`}>
                                        {item.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 italic max-w-[200px] truncate">{item.resolucion || "Sin resolución"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 bg-white/5 text-gray-600 hover:text-amber-500 rounded-lg border border-white/5 hover:border-amber-500/20 transition-all" onClick={() => openModal("incidencia", item)} title="Gestionar">
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                )}

                {activeSection === "cuentas" && (
                    <AdminTable
                        columns={[
                            { label: "Usuario", key: "username", sortable: true },
                            { label: "Email", key: "email", sortable: true },
                            { label: "Rol", key: "rol", sortable: true },
                            { label: "Estado", key: "activo", align: "center", sortable: true },
                            { label: "Acciones", key: "acciones", align: "right", sortable: false },
                        ]}
                        data={cuentas}
                        renderRow={(item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-black text-white">
                                            {item.username[0].toUpperCase()}
                                        </div>
                                        <span className="font-black text-white text-sm uppercase tracking-tight italic font-['Outfit']">{item.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-400 italic">{item.email}</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{item.rol}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${item.activo ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                        {item.activo ? "Activo" : "Baneado"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 bg-white/5 text-gray-600 hover:text-amber-500 rounded-lg border border-white/5 hover:border-amber-500/20 transition-all" onClick={() => openModal("cuenta", item)} title="Editar Cuenta">
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                )}
            </div>

            {/* MODAL REDISEÑADO AL ESTILO ECOMMERCE */}
            <AdminModal
                show={Boolean(modal.type)}
                onClose={closeModal}
                title={modal.type === "torneo-create" ? "CREAR NUEVO TORNEO" : `EDITAR ${modal.type?.toUpperCase()}`}
                maxWidth={modal.type === "torneo-create" ? "max-w-4xl" : "max-w-xl"}
            >
                <form onSubmit={submitModal} className="space-y-6">
                    {modal.type === "torneo-create" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3">
                                    <Trophy className="text-red-600" size={24} />
                                    <div>
                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Información Básica</p>
                                        <p className="text-xs text-gray-400 font-medium italic">Define los parámetros principales de la competición</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <FieldWrapper label="Nombre del Torneo">
                                    <input type="text" value={form.nombre} onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="Ej: TierOne Elite Cup" />
                                </FieldWrapper>
                                <FieldWrapper label="Juego">
                                    <select value={form.id_juego} onChange={(e) => setForm(p => ({ ...p, id_juego: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all">
                                        <option value="">Seleccionar juego...</option>
                                        {juegos.map(j => <option key={j.id} value={j.id}>{j.nombre}</option>)}
                                    </select>
                                </FieldWrapper>
                                <FieldWrapper label="Formato">
                                    <select value={form.formato} onChange={(e) => setForm(p => ({ ...p, formato: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all uppercase text-[10px]">
                                        {torneoFormats.map(f => <option key={f} value={f}>{f.replace('_', ' ').toUpperCase()}</option>)}
                                    </select>
                                </FieldWrapper>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FieldWrapper label="Max. Participantes">
                                        <input type="number" value={form.max_participantes} onChange={(e) => setForm(p => ({ ...p, max_participantes: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" />
                                    </FieldWrapper>
                                    <FieldWrapper label="Cuota (€)">
                                        <input type="number" value={form.cuota_inscripcion} onChange={(e) => setForm(p => ({ ...p, cuota_inscripcion: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" />
                                    </FieldWrapper>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FieldWrapper label="Premio Total (€)">
                                        <input type="number" value={form.premio_total} onChange={(e) => setForm(p => ({ ...p, premio_total: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" />
                                    </FieldWrapper>
                                    <FieldWrapper label="Comisión (%)">
                                        <input type="number" value={form.comision_plataforma_porcentaje} onChange={(e) => setForm(p => ({ ...p, comision_plataforma_porcentaje: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" />
                                    </FieldWrapper>
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-6">
                                <FieldWrapper label="Fecha Inicio">
                                    <input type="datetime-local" value={form.fecha_inicio} onChange={(e) => setForm(p => ({ ...p, fecha_inicio: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all text-xs" />
                                </FieldWrapper>
                                <FieldWrapper label="Fecha Fin">
                                    <input type="datetime-local" value={form.fecha_fin} onChange={(e) => setForm(p => ({ ...p, fecha_fin: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all text-xs" />
                                </FieldWrapper>
                                <FieldWrapper label="Cierre Inscripciones">
                                    <input type="datetime-local" value={form.cierre_inscripciones} onChange={(e) => setForm(p => ({ ...p, cierre_inscripciones: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all text-xs" />
                                </FieldWrapper>
                            </div>

                            <div className="md:col-span-2 space-y-4 pt-4 border-t border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FieldWrapper label="Imagen Banner (URL)">
                                        <input type="text" value={form.imagen_banner} onChange={(e) => setForm(p => ({ ...p, imagen_banner: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="URL del banner del torneo..." />
                                    </FieldWrapper>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldWrapper label="URL Reglas">
                                            <input type="text" value={form.reglas_url} onChange={(e) => setForm(p => ({ ...p, reglas_url: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="URL documento..." />
                                        </FieldWrapper>
                                        <FieldWrapper label="URL Stream">
                                            <input type="text" value={form.stream_url} onChange={(e) => setForm(p => ({ ...p, stream_url: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="Twitch/YouTube..." />
                                        </FieldWrapper>
                                    </div>
                                </div>
                                <FieldWrapper label="Descripción / Introducción">
                                    <textarea value={form.descripcion} onChange={(e) => setForm(p => ({ ...p, descripcion: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all min-h-[100px]" rows="3" placeholder="Explica de qué trata este torneo..."></textarea>
                                </FieldWrapper>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <div className="flex gap-6 p-4 bg-[#1A1A1A] rounded-2xl border border-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.es_gratuito ? 'bg-red-600 border-red-600' : 'bg-[#1A1A1A] border-white/10'}`}>
                                            {form.es_gratuito && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={form.es_gratuito} onChange={(e) => setForm(p => ({ ...p, es_gratuito: e.target.checked }))} />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Gratuito</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.verificado ? 'bg-blue-600 border-blue-600' : 'bg-[#1A1A1A] border-white/10'}`}>
                                            {form.verificado && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={form.verificado} onChange={(e) => setForm(p => ({ ...p, verificado: e.target.checked }))} />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Verificado</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : modal.type === "juego-create" || modal.type === "juego" ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FieldWrapper label="Nombre del Videojuego">
                            <input type="text" value={form.nombre} onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="Ej: League of Legends" />
                        </FieldWrapper>
                        <FieldWrapper label="Slug (URL)">
                            <input type="text" value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="ej: league-of-legends" />
                        </FieldWrapper>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldWrapper label="Categoría">
                            <input type="text" value={form.categoria} onChange={(e) => setForm(p => ({ ...p, categoria: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="Ej: MOBA" />
                        </FieldWrapper>
                        <FieldWrapper label="Imagen URL">
                            <input type="text" value={form.imagen_url} onChange={(e) => setForm(p => ({ ...p, imagen_url: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" placeholder="URL de la carátula..." />
                        </FieldWrapper>
                    </div>
                    <FieldWrapper label="Descripción Breve">
                        <textarea value={form.descripcion} onChange={(e) => setForm(p => ({ ...p, descripcion: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all min-h-[100px]" rows="3" placeholder="Resumen del juego..."></textarea>
                    </FieldWrapper>
                    <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#1A1A1A] rounded-2xl border border-white/5 w-fit">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.activo ? 'bg-green-600 border-green-600' : 'bg-[#1A1A1A] border-white/10'}`}>
                            {form.activo && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={form.activo} onChange={(e) => setForm(p => ({ ...p, activo: e.target.checked }))} />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Activo para Torneos</span>
                    </label>
                </div>
                    ) : modal.type === "incidencia" ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl mb-4">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Detalle del Reporte</p>
                                <p className="text-xs text-gray-400 italic">"{modal.item?.descripcion || "Sin descripción"}"</p>
                            </div>
                            <FieldWrapper label="Estado de la Resolución">
                                <select value={form.estado} onChange={(e) => setForm(p => ({ ...p, estado: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all">
                                    {incidenciaStates.map(s => <option key={s} value={s}>{s.toUpperCase().replace('_', ' ')}</option>)}
                                </select>
                            </FieldWrapper>
                            <FieldWrapper label="Resolución Final">
                                <textarea value={form.resolucion} onChange={(e) => setForm(p => ({ ...p, resolucion: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all min-h-[120px]" rows="4" placeholder="Explica las medidas tomadas..."></textarea>
                            </FieldWrapper>
                        </div>
                    ) : modal.type === "cuenta" ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FieldWrapper label="Username">
                            <input type="text" value={form.username} onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" />
                        </FieldWrapper>
                        <FieldWrapper label="Rol">
                            <select value={form.rol} onChange={(e) => setForm(p => ({ ...p, rol: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all">
                                {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                            </select>
                        </FieldWrapper>
                    </div>
                    <FieldWrapper label="Email">
                        <input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" />
                    </FieldWrapper>
                    <div className="flex gap-6 p-4 bg-[#1A1A1A] rounded-2xl border border-white/5 mt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.activo ? 'bg-green-600 border-green-600' : 'bg-[#1A1A1A] border-white/10'}`}>
                                {form.activo && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={form.activo} onChange={(e) => setForm(p => ({ ...p, activo: e.target.checked }))} />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Usuario Activo</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.verificado ? 'bg-blue-600 border-blue-600' : 'bg-[#1A1A1A] border-white/10'}`}>
                                {form.verificado && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={form.verificado} onChange={(e) => setForm(p => ({ ...p, verificado: e.target.checked }))} />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Email Verificado</span>
                        </label>
                    </div>
                </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Campos genéricos para edición rápida (Torneo existente / Partida) */}
                            <FieldWrapper label="Estado Actual">
                                <select value={form.estado} onChange={(e) => setForm(p => ({ ...p, estado: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all">
                                    {modal.type === "torneo" ? torneoStates.map(s => <option key={s.value} value={s.value}>{s.label}</option>) : partidaStates.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </FieldWrapper>
                            {modal.type === "torneo" && (
                                <FieldWrapper label="Máximo Participantes">
                                    <input type="number" value={form.max_participantes} onChange={(e) => setForm(p => ({ ...p, max_participantes: e.target.value }))} className="w-full p-4 bg-[#1A1A1A] border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-white font-bold transition-all" />
                                </FieldWrapper>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
                        <button type="button" onClick={closeModal} className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all">
                            Cancelar
                        </button>
                        <button type="submit" className="px-10 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 active:scale-95 transition-all">
                            Guardar Registro
                        </button>
                    </div>
                </form>
            </AdminModal>
        </PanelLayout>
    );
}

function FieldWrapper({ label, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                {label}
            </label>
            {children}
        </div>
    );
}

function normalizeTorneoPayload(form) {
    return {
        id_juego: Number(form.id_juego),
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagen_banner: form.imagen_banner,
        formato: form.formato,
        max_participantes: Number(form.max_participantes),
        cuota_inscripcion: Number(form.cuota_inscripcion),
        premio_total: Number(form.premio_total),
        comision_plataforma_porcentaje: Number(form.comision_plataforma_porcentaje),
        es_gratuito: Boolean(form.es_gratuito),
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        cierre_inscripciones: form.cierre_inscripciones,
        estado: form.estado,
        reglas_url: form.reglas_url,
        stream_url: form.stream_url,
        verificado: Boolean(form.verificado),
    };
}

function formatDateTimeInput(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

import { Head, router, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import AdminTable from "@/Components/PanelAdminEcommerce/AdminTable";
import AdminModal from "@/Components/PanelAdminEcommerce/AdminModal";
import FilterBar from "@/Components/PanelAdminEcommerce/FilterBar";

const torneoStates = ["inscripciones", "en_curso", "finalizado", "cancelado"];
const torneoFormats = ["eliminacion_simple", "doble_eliminacion", "round_robin", "swiss"];
const partidaStates = ["pendiente", "en_proceso", "completada", "cancelada"];
const partidaTypes = ["1v1", "2v2", "5v5", "custom"];
const incidenciaStates = ["pendiente", "en_revision", "resuelta", "desestimada"];
const roles = ["player", "admin", "streamer"];

export default function PanelAdminGaming({
    filters = {},
    juegos = [],
    torneos = [],
    partidas = [],
    incidencias = [],
    cuentas = [],
}) {
    const { auth } = usePage().props;
    const activeSection = filters.section || "torneos";
    const [modal, setModal] = useState({ type: null, item: null });
    const [form, setForm] = useState({});

    const menuItems = useMemo(
        () => [
            {
                title: "Gaming Core",
                items: [
                    { label: "Torneos", icon: "Trophy", link: route("panel.gaming.index", { section: "torneos", search: filters.search || "" }) },
                    { label: "Partidas", icon: "Swords", link: route("panel.gaming.index", { section: "partidas", search: filters.search || "" }) },
                ],
            },
            {
                title: "Moderacion",
                items: [
                    {
                        label: "Incidencias",
                        icon: "ShieldAlert",
                        link: route("panel.gaming.index", {
                            section: "incidencias",
                            search: filters.search || "",
                            incidencias_sort: filters.incidencias_sort || "newest",
                        }),
                    },
                    { label: "Cuentas", icon: "UserCog", link: route("panel.gaming.index", { section: "cuentas", search: filters.search || "" }) },
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
            id_juego: juegos[0]?.id ?? "",
            nombre: "",
            descripcion: "",
            imagen_banner: "",
            formato: "eliminacion_simple",
            cuota_inscripcion: 0,
            premio_total: 0,
            comision_plataforma_porcentaje: 10,
            es_gratuito: false,
            fecha_inicio: "",
            fecha_fin: "",
            cierre_inscripciones: "",
            reglas_url: "",
            stream_url: "",
        };

        if (type === "torneo") {
            initial.id_juego = item?.id_juego ?? juegos[0]?.id ?? "";
            initial.nombre = item?.nombre ?? "";
            initial.descripcion = item?.descripcion ?? "";
            initial.imagen_banner = item?.imagen_banner ?? "";
            initial.formato = item?.formato ?? "eliminacion_simple";
            initial.cuota_inscripcion = item?.cuota_inscripcion ?? 0;
            initial.premio_total = item?.premio_total ?? 0;
            initial.comision_plataforma_porcentaje = item?.comision_plataforma_porcentaje ?? 10;
            initial.es_gratuito = Boolean(item?.es_gratuito);
            initial.fecha_inicio = formatDateTimeInput(item?.fecha_inicio);
            initial.fecha_fin = formatDateTimeInput(item?.fecha_fin);
            initial.cierre_inscripciones = formatDateTimeInput(item?.cierre_inscripciones);
            initial.reglas_url = item?.reglas_url ?? "";
            initial.stream_url = item?.stream_url ?? "";
            initial.verificado = Boolean(item?.verificado);
        }

        setModal({ type, item });
        setForm(initial);
    };

    const closeModal = () => {
        setModal({ type: null, item: null });
        setForm({});
    };

    const handleSortIncidencias = () => {
        router.get(
            route("panel.gaming.index"),
            {
                ...filters,
                section: "incidencias",
                incidencias_sort: (filters.incidencias_sort || "newest") === "newest" ? "oldest" : "newest",
            },
            { preserveState: true, replace: true },
        );
    };

    const submitModal = () => {
        const id = modal.item?.id;

        if (modal.type === "torneo-create") {
            router.post(route("panel.gaming.torneos.store"), normalizeTorneoPayload(form), {
                preserveScroll: true,
                onSuccess: closeModal,
            });
            return;
        }

        if (!id) return;

        if (modal.type === "torneo") {
            router.put(
                route("panel.gaming.torneos.update", id),
                {
                    estado: form.estado,
                    max_participantes: Number(form.max_participantes),
                },
                { preserveScroll: true, onSuccess: closeModal },
            );
        }

        if (modal.type === "partida") {
            router.put(
                route("panel.gaming.partidas.update", id),
                {
                    estado: form.estado,
                    tipo: form.tipo,
                },
                { preserveScroll: true, onSuccess: closeModal },
            );
        }

        if (modal.type === "incidencia") {
            router.put(
                route("panel.gaming.incidencias.update", id),
                {
                    estado: form.estado,
                    resolucion: form.resolucion,
                },
                { preserveScroll: true, onSuccess: closeModal },
            );
        }

        if (modal.type === "cuenta") {
            router.put(
                route("panel.gaming.cuentas.update", id),
                {
                    username: form.username,
                    email: form.email,
                    rol: form.rol,
                    activo: Boolean(form.activo),
                    verificado: Boolean(form.verificado),
                },
                { preserveScroll: true, onSuccess: closeModal },
            );
        }
    };

    const filtersConfig = [{ name: "search", label: "Buscar", type: "text" }];
    const activeLabel = activeSection === "partidas" ? "Partidas" : activeSection === "incidencias" ? "Incidencias" : activeSection === "cuentas" ? "Cuentas" : "Torneos";

    return (
        <PanelLayout
            title="Panel Admin Gaming"
            activeItem={activeLabel}
            menuItems={menuItems}
            showGamingShortcut
            shortcutLink={route("panel.ecommerce.dashboard")}
            shortcutLabel="Administrar Ecommerce"
        >
            <Head title="Panel Admin Gaming" />

            <div className="space-y-4 text-black">
                <FilterBar filtersConfig={filtersConfig} currentFilters={filters} routeName="panel.gaming.index" />

                {activeSection === "torneos" && (
                    <>
                        <div className="flex justify-end">
                            <button onClick={() => openModal("torneo-create")} className="rounded bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
                                Crear torneo
                            </button>
                        </div>
                        <AdminTable
                            columns={[
                                { label: "Torneo", key: "nombre" },
                                { label: "Juego", key: "juego" },
                                { label: "Organizador", key: "organizador" },
                                { label: "Inscritos", key: "inscritos", align: "center" },
                                { label: "Estado", key: "estado", align: "center" },
                                { label: "Acciones", key: "acciones", align: "right" },
                            ]}
                            data={torneos}
                            renderRow={(item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 font-bold text-black">{item.nombre}</td>
                                    <td className="px-6 py-4 text-black">{item.juego?.nombre ?? "-"}</td>
                                    <td className="px-6 py-4 text-black">{item.organizador?.username ?? "-"}</td>
                                    <td className="px-6 py-4 text-black">{item.inscripciones_count}/{item.max_participantes}</td>
                                    <td className="px-6 py-4 text-black">{item.estado}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white" onClick={() => openModal("torneo", item)}>Editar</button>
                                            <button className="rounded bg-red-600 px-2 py-1 text-xs text-white" onClick={() => router.delete(route("panel.gaming.torneos.destroy", item.id), { preserveScroll: true })}>Borrar</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        />
                    </>
                )}

                {activeSection === "partidas" && (
                    <AdminTable
                        columns={[
                            { label: "Partida", key: "titulo" },
                            { label: "Juego", key: "juego" },
                            { label: "Creador", key: "creador" },
                            { label: "Jugadores", key: "participantes", align: "center" },
                            { label: "Estado", key: "estado", align: "center" },
                            { label: "Acciones", key: "acciones", align: "right" },
                        ]}
                        data={partidas}
                        renderRow={(item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 font-bold text-black">{item.titulo}</td>
                                <td className="px-6 py-4 text-black">{item.juego?.nombre ?? "-"}</td>
                                <td className="px-6 py-4 text-black">{item.creador?.username ?? "-"}</td>
                                <td className="px-6 py-4 text-black">{item.participantes_count}</td>
                                <td className="px-6 py-4 text-black">{item.estado}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white" onClick={() => openModal("partida", item)}>Editar</button>
                                        <button className="rounded bg-red-600 px-2 py-1 text-xs text-white" onClick={() => router.delete(route("panel.gaming.partidas.destroy", item.id), { preserveScroll: true })}>Borrar</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                )}

                {activeSection === "incidencias" && (
                    <>
                        <div className="flex justify-end">
                            <button onClick={handleSortIncidencias} className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-black">
                                {filters.incidencias_sort === "oldest" ? "Orden: antiguas" : "Orden: nuevas"}
                            </button>
                        </div>
                        <AdminTable
                            columns={[
                                { label: "Tipo", key: "tipo" },
                                { label: "Partida", key: "partida" },
                                { label: "Reporta", key: "usuario" },
                                { label: "Atendido por", key: "atendido" },
                                { label: "Fecha", key: "fecha" },
                                { label: "Estado", key: "estado", align: "center" },
                                { label: "Acciones", key: "acciones", align: "right" },
                            ]}
                            data={incidencias}
                            renderRow={(item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 font-bold text-black">{item.tipo}</td>
                                    <td className="px-6 py-4 text-black">{item.partida?.titulo ?? "-"}</td>
                                    <td className="px-6 py-4 text-black">{item.usuario_reporta?.username ?? "-"}</td>
                                    <td className="px-6 py-4 text-black">{item.resuelto_por?.username ?? auth?.user?.username ?? "admin"}</td>
                                    <td className="px-6 py-4 text-black">{formatDate(item.fecha_reporte)}</td>
                                    <td className="px-6 py-4 text-black">{item.estado}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white" onClick={() => openModal("incidencia", item)}>Gestionar</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        />
                    </>
                )}

                {activeSection === "cuentas" && (
                    <AdminTable
                        columns={[
                            { label: "Usuario", key: "username" },
                            { label: "Email", key: "email" },
                            { label: "Rol", key: "rol", align: "center" },
                            { label: "Estado", key: "estado", align: "center" },
                            { label: "Acciones", key: "acciones", align: "right" },
                        ]}
                        data={cuentas}
                        renderRow={(item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 font-bold text-black">{item.username}</td>
                                <td className="px-6 py-4 text-black">{item.email}</td>
                                <td className="px-6 py-4 text-black">{item.rol}</td>
                                <td className="px-6 py-4 text-black">{item.activo ? "activa" : "bloqueada"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white" onClick={() => openModal("cuenta", item)}>Editar</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                )}
            </div>

            <AdminModal
                show={Boolean(modal.type)}
                onClose={closeModal}
                title={modal.type === "torneo-create" ? "Crear torneo" : "Editar registro"}
                maxWidth={modal.type === "torneo-create" ? "max-w-3xl" : "max-w-lg"}
            >
                <div className="space-y-4 text-black">
                    {(modal.type === "torneo" || modal.type === "partida" || modal.type === "incidencia") && (
                        <FieldSelect label="Estado" value={form.estado} onChange={(v) => setForm((p) => ({ ...p, estado: v }))} options={modal.type === "torneo" ? torneoStates : modal.type === "partida" ? partidaStates : incidenciaStates} />
                    )}

                    {modal.type === "torneo" && (
                        <FieldInput label="Max participantes" type="number" value={form.max_participantes} onChange={(v) => setForm((p) => ({ ...p, max_participantes: v }))} />
                    )}

                    {modal.type === "partida" && (
                        <FieldSelect label="Tipo" value={form.tipo} onChange={(v) => setForm((p) => ({ ...p, tipo: v }))} options={partidaTypes} />
                    )}

                    {modal.type === "incidencia" && (
                        <FieldTextarea label="Resolucion" value={form.resolucion} onChange={(v) => setForm((p) => ({ ...p, resolucion: v }))} />
                    )}

                    {modal.type === "cuenta" && (
                        <>
                            <FieldInput label="Nombre de usuario" value={form.username} onChange={(v) => setForm((p) => ({ ...p, username: v }))} />
                            <FieldInput label="Email" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
                            <FieldSelect label="Rol" value={form.rol} onChange={(v) => setForm((p) => ({ ...p, rol: v }))} options={roles} />
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.activo)} onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))} /> Cuenta activa</label>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.verificado)} onChange={(e) => setForm((p) => ({ ...p, verificado: e.target.checked }))} /> Verificada</label>
                        </>
                    )}

                    {modal.type === "torneo-create" && (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <FieldSelect label="Juego" value={form.id_juego} onChange={(v) => setForm((p) => ({ ...p, id_juego: v }))} options={juegos.map((j) => ({ value: j.id, label: j.nombre }))} />
                            <FieldInput label="Nombre" value={form.nombre} onChange={(v) => setForm((p) => ({ ...p, nombre: v }))} />
                            <FieldInput label="Descripcion" value={form.descripcion} onChange={(v) => setForm((p) => ({ ...p, descripcion: v }))} />
                            <FieldInput label="Imagen banner URL" value={form.imagen_banner} onChange={(v) => setForm((p) => ({ ...p, imagen_banner: v }))} />
                            <FieldSelect label="Formato" value={form.formato} onChange={(v) => setForm((p) => ({ ...p, formato: v }))} options={torneoFormats} />
                            <FieldInput label="Max participantes" type="number" value={form.max_participantes} onChange={(v) => setForm((p) => ({ ...p, max_participantes: v }))} />
                            <FieldInput label="Cuota inscripcion" type="number" value={form.cuota_inscripcion} onChange={(v) => setForm((p) => ({ ...p, cuota_inscripcion: v }))} />
                            <FieldInput label="Premio total" type="number" value={form.premio_total} onChange={(v) => setForm((p) => ({ ...p, premio_total: v }))} />
                            <FieldInput label="Comision %" type="number" value={form.comision_plataforma_porcentaje} onChange={(v) => setForm((p) => ({ ...p, comision_plataforma_porcentaje: v }))} />
                            <FieldInput label="Fecha inicio" type="datetime-local" value={form.fecha_inicio} onChange={(v) => setForm((p) => ({ ...p, fecha_inicio: v }))} />
                            <FieldInput label="Fecha fin" type="datetime-local" value={form.fecha_fin} onChange={(v) => setForm((p) => ({ ...p, fecha_fin: v }))} />
                            <FieldInput label="Cierre inscripciones" type="datetime-local" value={form.cierre_inscripciones} onChange={(v) => setForm((p) => ({ ...p, cierre_inscripciones: v }))} />
                            <FieldSelect label="Estado" value={form.estado} onChange={(v) => setForm((p) => ({ ...p, estado: v }))} options={torneoStates} />
                            <FieldInput label="Reglas URL" value={form.reglas_url} onChange={(v) => setForm((p) => ({ ...p, reglas_url: v }))} />
                            <FieldInput label="Stream URL" value={form.stream_url} onChange={(v) => setForm((p) => ({ ...p, stream_url: v }))} />
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.es_gratuito)} onChange={(e) => setForm((p) => ({ ...p, es_gratuito: e.target.checked }))} /> Torneo gratuito</label>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.verificado)} onChange={(e) => setForm((p) => ({ ...p, verificado: e.target.checked }))} /> Verificado</label>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={closeModal} className="rounded border border-gray-300 px-4 py-2 text-sm text-black">Cancelar</button>
                        <button type="button" onClick={submitModal} className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white">Guardar</button>
                    </div>
                </div>
            </AdminModal>
        </PanelLayout>
    );
}

function FieldInput({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">{label}</label>
            <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-black" />
        </div>
    );
}

function FieldSelect({ label, value, onChange, options = [] }) {
    const normalized = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
    return (
        <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">{label}</label>
            <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-black">
                {normalized.map((o) => (
                    <option key={String(o.value)} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}

function FieldTextarea({ label, value, onChange }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">{label}</label>
            <textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-black" />
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

function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("es-ES");
}

function formatDateTimeInput(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

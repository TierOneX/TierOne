import { Head, useForm } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

/* ─── Iconos mínimos inline ───────────────────────────────────────────────── */
const Icon = {
    user: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
        </svg>
    ),
    trophy: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.396 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
            />
        </svg>
    ),
    bag: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
            />
        </svg>
    ),
    lock: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
        </svg>
    ),
    shield: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z"
            />
        </svg>
    ),

    eye: (open) =>
        open ? (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
            </svg>
        ) : (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
            </svg>
        ),
    check: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-3.5 h-3.5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
            />
        </svg>
    ),
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const estadoTorneoColor = {
    inscripciones: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    en_curso: "bg-[#e31837]/15 text-[#e31837] border-[#e31837]/30",
    finalizado: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    cancelado: "bg-red-900/30 text-red-500 border-red-900/40",
};
const estadoOrdenColor = {
    pendiente: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    pagada: "bg-green-500/15 text-green-400 border-green-500/30",
    enviada_proveedor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    en_transito: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    entregada: "bg-green-800/30 text-green-300 border-green-700/30",
    cancelada: "bg-red-900/30 text-red-500 border-red-900/40",
};
const fmt = (d) =>
    d
        ? new Date(d).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "—";
const money = (n) => `${Number(n).toFixed(2)} €`;

/* ─── Input helper ────────────────────────────────────────────────────────── */
const Field = ({ label, id, error, children }) => (
    <div>
        <label
            htmlFor={id}
            className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 mb-1.5"
        >
            {label}
        </label>
        {children}
        {error && (
            <p className="mt-1 text-[10px] text-[#e31837] font-semibold">
                {error}
            </p>
        )}
    </div>
);
const inputCls =
    "w-full rounded-lg bg-[#0d0d0d] border border-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e31837]/60 focus:ring-1 focus:ring-[#e31837]/40 transition-all duration-200 disabled:opacity-40";

/* ─── Subcomponentes de sección ──────────────────────────────────────────── */

function SectionMiPerfil({ user, status }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        username: user.username ?? "",
        email: user.email ?? "",
        nombre: user.nombre ?? "",
        apellido: user.apellido ?? "",
        pais: user.pais ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <div className="space-y-8">
            {/* Avatar + nombre */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e31837]/30 to-[#0a0a0a] border-2 border-[#e31837]/40 flex items-center justify-center text-2xl font-black text-white select-none">
                            {(user.username ?? "?")[0].toUpperCase()}
                        </div>
                        <div
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#131313]"
                            title="En línea"
                        />
                    </div>
                    <div>
                        <p className="text-lg font-black text-white">
                            {user.username}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-widest">
                            {user.rol ?? "jugador"} · Desde{" "}
                            {fmt(user.fecha_registro)}
                        </p>
                    </div>
                </div>

                {user.rol === "admin" && (
                    <Link
                        href={route("panel.ecommerce.dashboard")}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#e31837] hover:bg-[#c41430] text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-900/20"
                    >
                        <span className="opacity-80">{Icon.shield}</span>
                        Panel Admin
                    </Link>
                )}
            </div>

            {status === "profile-updated" && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-[11px] font-semibold text-green-400 uppercase tracking-widest">
                    {Icon.check} Perfil actualizado correctamente
                </div>
            )}

            <form
                onSubmit={submit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                <Field
                    label="Nombre de usuario"
                    id="username"
                    error={errors.username}
                >
                    <input
                        id="username"
                        className={inputCls}
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        autoComplete="username"
                    />
                </Field>
                <Field label="Email" id="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        className={inputCls}
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                </Field>
                <Field label="Nombre" id="nombre" error={errors.nombre}>
                    <input
                        id="nombre"
                        className={inputCls}
                        value={data.nombre}
                        onChange={(e) => setData("nombre", e.target.value)}
                        placeholder="Tu nombre"
                    />
                </Field>
                <Field label="Apellido" id="apellido" error={errors.apellido}>
                    <input
                        id="apellido"
                        className={inputCls}
                        value={data.apellido}
                        onChange={(e) => setData("apellido", e.target.value)}
                        placeholder="Tu apellido"
                    />
                </Field>
                <Field label="País" id="pais" error={errors.pais}>
                    <input
                        id="pais"
                        className={inputCls}
                        value={data.pais}
                        onChange={(e) => setData("pais", e.target.value)}
                        placeholder="España"
                    />
                </Field>

                <div className="sm:col-span-2 flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-[#e31837] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#c41430] disabled:opacity-50 transition-colors"
                    >
                        {processing ? "Guardando…" : "Guardar cambios"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function SectionTorneos({ organizados, inscritos }) {
    const [tab, setTab] = useState("inscritos");

    const lista = tab === "organizados" ? organizados : inscritos;

    const TorneoCard = ({ item }) => {
        const torneo = tab === "organizados" ? item : item.torneo;
        if (!torneo) return null;
        const estado = torneo.estado ?? "—";
        return (
            <div className="relative rounded-xl bg-[#0d0d0d] border border-white/[0.06] p-4 flex flex-col gap-2 hover:border-[#e31837]/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-bold text-white leading-tight">
                            {torneo.nombre}
                        </p>
                        {torneo.juego && (
                            <p className="text-[10px] text-gray-500 mt-0.5">
                                {torneo.juego.nombre}
                            </p>
                        )}
                    </div>
                    <span
                        className={`shrink-0 text-[9px] font-black uppercase tracking-widest rounded-full border px-2.5 py-1 ${estadoTorneoColor[estado] ?? estadoTorneoColor.cancelado}`}
                    >
                        {estado.replace("_", " ")}
                    </span>
                </div>
                <div className="flex gap-4 text-[10px] text-gray-500">
                    <span>Inicio: {fmt(torneo.fecha_inicio)}</span>
                    <span>Fin: {fmt(torneo.fecha_fin)}</span>
                </div>
                {tab === "organizados" && (
                    <p className="text-[10px] text-[#e31837]/80">
                        Premio total: {money(torneo.premio_total)}
                    </p>
                )}
                {tab === "inscritos" && (
                    <p className="text-[10px] text-gray-500">
                        Inscripción: {fmt(item.fecha_inscripcion)} · Estado:{" "}
                        <span className="text-white">{item.estado}</span>
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-5">
            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-[#0d0d0d] border border-white/[0.06] p-1 w-fit">
                {[
                    ["inscritos", "Inscritos"],
                    ["organizados", "Organizados"],
                ].map(([k, label]) => (
                    <button
                        key={k}
                        onClick={() => setTab(k)}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${tab === k ? "bg-[#e31837] text-white" : "text-gray-500 hover:text-gray-300"}`}
                    >
                        {label}{" "}
                        <span className="ml-1 opacity-60">
                            (
                            {
                                (k === "inscritos" ? inscritos : organizados)
                                    .length
                            }
                            )
                        </span>
                    </button>
                ))}
            </div>

            {lista.length === 0 ? (
                <div className="py-16 text-center text-gray-600 text-sm">
                    {tab === "inscritos"
                        ? "Aún no estás inscrito en ningún torneo."
                        : "No has organizado ningún torneo todavía."}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lista.map((item) => (
                        <TorneoCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SectionCompras({ ordenes }) {
    const [open, setOpen] = useState(null);

    return (
        <div className="space-y-3">
            {ordenes.length === 0 ? (
                <div className="py-16 text-center text-gray-600 text-sm">
                    No hay compras registradas todavía.
                </div>
            ) : (
                ordenes.map((orden) => (
                    <div
                        key={orden.id}
                        className="rounded-xl bg-[#0d0d0d] border border-white/[0.06] overflow-hidden"
                    >
                        {/* Cabecera */}
                        <button
                            onClick={() =>
                                setOpen(open === orden.id ? null : orden.id)
                            }
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-xs font-black text-white">
                                        # {orden.numero_orden}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                        {fmt(orden.fecha_orden)}
                                    </p>
                                </div>
                                <span
                                    className={`text-[9px] font-black uppercase tracking-widest rounded-full border px-2.5 py-1 ${estadoOrdenColor[orden.estado] ?? estadoOrdenColor.pendiente}`}
                                >
                                    {orden.estado.replace(/_/g, " ")}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-black text-[#e31837]">
                                    {money(orden.total)}
                                </span>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className={`w-4 h-4 text-gray-500 transition-transform ${open === orden.id ? "rotate-180" : ""}`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </div>
                        </button>

                        {/* Items desplegables */}
                        {open === orden.id && (
                            <div className="px-5 pb-4 border-t border-white/[0.05] space-y-2 pt-3">
                                {(orden.items ?? []).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between text-xs text-gray-300"
                                    >
                                        <span>
                                            {item.producto?.nombre ??
                                                "Producto eliminado"}{" "}
                                            <span className="text-gray-600">
                                                ×{item.cantidad}
                                            </span>
                                        </span>
                                        <span className="text-white font-semibold">
                                            {money(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                                {orden.tracking_number && (
                                    <p className="text-[10px] text-gray-500 pt-1 border-t border-white/[0.04]">
                                        Tracking:{" "}
                                        <span className="text-gray-300 font-mono">
                                            {orden.tracking_number}
                                        </span>
                                        {orden.transportista &&
                                            ` · ${orden.transportista}`}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

function SectionSeguridad({ status }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("profile.password"), { onSuccess: () => reset() });
    };

    const PwdInput = ({ id, label, field, showKey, placeholder }) => (
        <Field label={label} id={id} error={errors[field]}>
            <div className="relative">
                <input
                    id={id}
                    type={show[showKey] ? "text" : "password"}
                    className={`${inputCls} pr-11`}
                    placeholder={placeholder}
                    value={data[field]}
                    onChange={(e) => setData(field, e.target.value)}
                />
                <button
                    type="button"
                    onClick={() =>
                        setShow((s) => ({ ...s, [showKey]: !s[showKey] }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e31837] transition-colors"
                >
                    {Icon.eye(show[showKey])}
                </button>
            </div>
        </Field>
    );

    return (
        <div className="space-y-6 max-w-md">
            {status === "password-updated" && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-[11px] font-semibold text-green-400 uppercase tracking-widest">
                    {Icon.check} Contraseña actualizada correctamente
                </div>
            )}
            <form onSubmit={submit} className="space-y-4">
                <PwdInput
                    id="current_password"
                    label="Contraseña actual"
                    field="current_password"
                    showKey="current"
                    placeholder="••••••••"
                />
                <PwdInput
                    id="new_password"
                    label="Nueva contraseña"
                    field="password"
                    showKey="new"
                    placeholder="Mínimo 8 caracteres"
                />
                <PwdInput
                    id="confirm_password"
                    label="Confirmar nueva contraseña"
                    field="password_confirmation"
                    showKey="confirm"
                    placeholder="Repite la contraseña"
                />
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-[#e31837] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#c41430] disabled:opacity-50 transition-colors"
                    >
                        {processing ? "Actualizando…" : "Cambiar contraseña"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function SectionAdministracion() {
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/[0.08] p-8 text-center">
                <div className="w-16 h-16 bg-[#e31837]/10 rounded-2xl flex items-center justify-center text-[#e31837] mx-auto mb-5 border border-[#e31837]/20">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Panel de Administración
                </h2>
                <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                    Tienes privilegios de administrador. Accede al panel para
                    gestionar productos, categorías, pedidos y más.
                </p>
                <Link
                    href={route("panel.ecommerce.dashboard")}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#e31837] hover:bg-[#c41430] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-900/20"
                >
                    Entrar al Panel
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    {
                        label: "Productos",
                        href: route("panel.ecommerce.products"),
                    },
                    {
                        label: "Categorías",
                        href: route("panel.ecommerce.categories"),
                    },
                    { label: "Pedidos", href: route("panel.ecommerce.orders") },
                    {
                        label: "Proveedores",
                        href: route("panel.ecommerce.proveedores"),
                    },
                ].map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#0d0d0d] border border-white/[0.05] hover:border-[#e31837]/30 transition-colors group"
                    >
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
                            {item.label}
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#e31837]/10 transition-colors">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="w-3 h-3 text-gray-600 group-hover:text-[#e31837]"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

/* ─── Estilos globales de la página ─────────────────────────────────────── */
const styles = `
    @keyframes profEnter {
        from { opacity:0; transform:translateY(14px) scale(0.99); }
        to   { opacity:1; transform:translateY(0)    scale(1);    }
    }
    .prof-enter { animation: profEnter 380ms cubic-bezier(0.22,1,0.36,1) both; }
    @keyframes kittH {
        0%   { left:-40%; width:40%; }
        100% { left:140%; width:40%; }
    }
    .kitt-h { position:absolute; top:0; left:0; right:0; height:2px; overflow:hidden; }
    .kitt-h::after {
        content:''; position:absolute; top:0; height:100%;
        background:linear-gradient(90deg,transparent,#e31837,transparent);
        box-shadow:0 0 10px 3px rgba(227,24,55,0.6);
        animation: kittH 2.5s linear infinite;
    }
`;

/* ─── Página principal ───────────────────────────────────────────────────── */
const TABS = [
    { id: "perfil", label: "Mi Perfil", icon: "user" },
    { id: "torneos", label: "Torneos", icon: "trophy" },
    { id: "compras", label: "Compras", icon: "bag" },
    { id: "seguridad", label: "Seguridad", icon: "lock" },
];

export default function Edit({
    mustVerifyEmail,
    status,
    torneosOrganizados,
    torneosInscritos,
    ordenes,
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [tab, setTab] = useState("perfil");

    const filteredTabs = TABS.filter((t) => {
        if (t.id === "administracion") return user.rol === "admin";
        return true;
    });

    if (user.rol === "admin" && !TABS.find((t) => t.id === "administracion")) {
        TABS.push({
            id: "administracion",
            label: "Administración",
            icon: "shield",
        });
    }

    return (
        <>
            <Head title="Mi Perfil" />
            <style>{styles}</style>
            <Header />

            <div className="min-h-screen bg-[#080808] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                {/* Cabecera de página */}
                <div className="max-w-5xl mx-auto mb-8 prof-enter">
                    <h1 className="text-2xl font-black uppercase tracking-[0.08em] text-white">
                        MI <span className="text-[#e31837]">PERFIL</span>
                    </h1>
                    <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">
                        Gestiona tu cuenta, torneos y compras
                    </p>
                </div>

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-5">
                    {/* Sidebar tabs */}
                    <aside className="md:w-52 shrink-0">
                        <nav className="flex md:flex-col gap-1 flex-row flex-wrap">
                            {filteredTabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-left
                                        ${
                                            tab === t.id
                                                ? "bg-[#e31837]/10 text-[#e31837] border border-[#e31837]/25"
                                                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent"
                                        }`}
                                >
                                    <span
                                        className={
                                            tab === t.id
                                                ? "text-[#e31837]"
                                                : "text-gray-600"
                                        }
                                    >
                                        {Icon[t.icon]}
                                    </span>
                                    {t.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Panel de contenido */}
                    <main className="flex-1 min-w-0">
                        <div className="relative overflow-hidden rounded-2xl bg-[#111] border border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 sm:p-8 prof-enter">
                            {/* KittLine superior */}
                            <div className="kitt-h" />

                            {/* Esquina decorativa */}
                            <div className="absolute bottom-0 right-0 w-8 h-px bg-[#e31837]/30" />
                            <div className="absolute bottom-0 right-0 w-px h-8 bg-[#e31837]/30" />

                            {tab === "perfil" && (
                                <SectionMiPerfil user={user} status={status} />
                            )}
                            {tab === "torneos" && (
                                <SectionTorneos
                                    organizados={torneosOrganizados ?? []}
                                    inscritos={torneosInscritos ?? []}
                                />
                            )}
                            {tab === "compras" && (
                                <SectionCompras ordenes={ordenes ?? []} />
                            )}
                            {tab === "seguridad" && (
                                <SectionSeguridad status={status} />
                            )}
                            {tab === "administracion" && (
                                <SectionAdministracion />
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </>
    );
}

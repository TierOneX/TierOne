import PanelLayout from "@/Components/PanelAdminEcommerce/PanelLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Activity,
    ArrowRight,
    BarChart3,
    ClipboardList,
    CreditCard,
    Gamepad2,
    Package,
    ShieldAlert,
    ShoppingBag,
    Swords,
    Trophy,
    Users,
} from "lucide-react";

const stats = [
    {
        label: "Gaming",
        value: "5 areas",
        detail: "Torneos, partidas, juegos, incidencias y cuentas",
        icon: Gamepad2,
        href: route("panel.superadmin.gaming.index", { section: "torneos" }),
    },
    {
        label: "Catalogo",
        value: "3 areas",
        detail: "Productos, categorias y proveedores",
        icon: Package,
        href: route("panel.superadmin.ecommerce.products"),
    },
    {
        label: "Ventas",
        value: "4 areas",
        detail: "Ordenes, pagos, transacciones y retiros",
        icon: ShoppingBag,
        href: route("panel.superadmin.ecommerce.orders"),
    },
    {
        label: "Moderacion",
        value: "2 areas",
        detail: "Incidencias gaming y reviews ecommerce",
        icon: ShieldAlert,
        href: route("panel.superadmin.gaming.index", { section: "incidencias" }),
    },
];

const workspaces = [
    {
        title: "Operacion Gaming",
        description: "Control competitivo y comunidad desde el mismo panel.",
        icon: Trophy,
        shortcut: {
            label: "Ir al panel admin gaming",
            href: route("panel.gaming.index"),
        },
        links: [
            { label: "Torneos", icon: Trophy, href: route("panel.superadmin.gaming.index", { section: "torneos" }) },
            { label: "Partidas", icon: Swords, href: route("panel.superadmin.gaming.index", { section: "partidas" }) },
            { label: "Juegos", icon: Gamepad2, href: route("panel.superadmin.gaming.index", { section: "juegos" }) },
            { label: "Incidencias", icon: ShieldAlert, href: route("panel.superadmin.gaming.index", { section: "incidencias" }) },
            { label: "Cuentas", icon: Users, href: route("panel.superadmin.gaming.index", { section: "cuentas" }) },
        ],
    },
    {
        title: "Operacion Ecommerce",
        description: "Catalogo, pedidos y finanzas sin salir del superadmin.",
        icon: BarChart3,
        shortcut: {
            label: "Ir al panel admin ecommerce",
            href: route("panel.ecommerce.dashboard"),
        },
        links: [
            { label: "Dashboard tienda", icon: BarChart3, href: route("panel.superadmin.ecommerce.dashboard") },
            { label: "Productos", icon: Package, href: route("panel.superadmin.ecommerce.products") },
            { label: "Ordenes", icon: ClipboardList, href: route("panel.superadmin.ecommerce.orders") },
            { label: "Pagos", icon: CreditCard, href: route("panel.superadmin.ecommerce.finanzas.pagos") },
        ],
    },
];

export default function SuperAdmin() {
    return (
        <PanelLayout title="Super Admin" activeItem="Dashboard" showGamingShortcut={false}>
            <Head title="Super Admin - TierOne" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                        Acceso global TierOne
                    </p>
                    <h2 className="mt-2 font-['Outfit'] text-3xl font-black uppercase italic tracking-[0.08em] text-white">
                        Panel unificado
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                        El superadmin concentra Gaming y Ecommerce en la misma interfaz:
                        usa el menu lateral para cambiar de seccion y conserva las tablas,
                        filtros, modales y acciones de cada area.
                    </p>
                </div>

                <Link
                    href={route("home")}
                    className="btn-secondary w-fit"
                >
                    Volver a la web
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link key={item.label} href={item.href} className="stat-card group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-500">
                                    <Icon size={20} />
                                </div>
                                <ArrowRight size={16} className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-red-500" />
                            </div>
                            <div className="mt-6 text-3xl font-black text-white">
                                {item.value}
                            </div>
                            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                {item.label}
                            </div>
                            <p className="mt-3 text-xs leading-5 text-gray-400">
                                {item.detail}
                            </p>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-2">
                {workspaces.map((workspace) => {
                    const WorkspaceIcon = workspace.icon;

                    return (
                        <section key={workspace.title} className="section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    <WorkspaceIcon size={16} className="text-red-500" />
                                    {workspace.title}
                                </h3>
                                <Activity size={16} className="text-gray-600" />
                            </div>
                            <p className="mb-6 text-sm leading-6 text-gray-400">
                                {workspace.description}
                            </p>
                            <Link
                                href={workspace.shortcut.href}
                                className="mb-5 flex w-full items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-red-500/60 hover:bg-red-500/20"
                            >
                                <span>{workspace.shortcut.label}</span>
                                <ArrowRight size={16} className="text-red-500" />
                            </Link>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {workspace.links.map((link) => {
                                    const LinkIcon = link.icon;

                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="group flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-gray-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
                                        >
                                            <span className="flex items-center gap-3">
                                                <LinkIcon size={16} className="text-red-500" />
                                                {link.label}
                                            </span>
                                            <ArrowRight size={14} className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-red-500" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>
        </PanelLayout>
    );
}

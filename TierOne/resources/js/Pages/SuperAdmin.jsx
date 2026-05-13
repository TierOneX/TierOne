import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    BarChart3,
    ClipboardList,
    Gamepad2,
    Package,
    ShieldCheck,
    ShoppingBag,
    Swords,
    Trophy,
    Users,
} from "lucide-react";

const panelCards = [
    {
        title: "Panel Gaming",
        description: "Torneos, partidas, juegos, incidencias y cuentas de usuario.",
        href: route("panel.gaming.index"),
        icon: Gamepad2,
        accent: "from-red-600 to-red-800",
        items: [
            { label: "Torneos", icon: Trophy },
            { label: "Partidas", icon: Swords },
            { label: "Cuentas", icon: Users },
        ],
    },
    {
        title: "Panel Ecommerce",
        description: "Productos, pedidos, categorias, proveedores, finanzas y reviews.",
        href: route("panel.ecommerce.dashboard"),
        icon: ShoppingBag,
        accent: "from-zinc-700 to-zinc-950",
        items: [
            { label: "Productos", icon: Package },
            { label: "Pedidos", icon: ClipboardList },
            { label: "Finanzas", icon: BarChart3 },
        ],
    },
];

export default function SuperAdmin() {
    return (
        <div className="min-h-screen bg-[#090909] text-white">
            <Head title="Super Admin" />

            <header className="border-b border-white/10 bg-[#111111]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
                            TierOne
                        </p>
                        <h1 className="mt-1 font-['Outfit'] text-2xl font-black uppercase italic tracking-[0.12em]">
                            Super Admin
                        </h1>
                    </div>

                    <Link
                        href={route("home")}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 transition hover:border-red-500/50 hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Volver a la web
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <section className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-red-300">
                        <ShieldCheck size={14} />
                        Acceso global
                    </div>
                    <h2 className="mt-5 max-w-3xl font-['Outfit'] text-3xl font-black uppercase italic tracking-[0.08em] sm:text-4xl">
                        Centro de control administrativo
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                        Desde aqui puedes entrar a las dos areas de administracion
                        y saltar entre ellas sin volver a la web publica.
                    </p>
                </section>

                <section className="grid gap-5 lg:grid-cols-2">
                    {panelCards.map((panel) => {
                        const Icon = panel.icon;

                        return (
                            <Link
                                key={panel.title}
                                href={panel.href}
                                className="group overflow-hidden rounded-lg border border-white/10 bg-[#141414] transition hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                            >
                                <div className={`h-1.5 bg-gradient-to-r ${panel.accent}`} />
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-red-400">
                                                <Icon size={24} />
                                            </span>
                                            <div>
                                                <h3 className="font-['Outfit'] text-xl font-black uppercase italic tracking-[0.12em]">
                                                    {panel.title}
                                                </h3>
                                                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-400">
                                                    {panel.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                        {panel.items.map((item) => {
                                            const ItemIcon = item.icon;

                                            return (
                                                <div
                                                    key={item.label}
                                                    className="flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-300"
                                                >
                                                    <ItemIcon size={15} className="text-red-400" />
                                                    {item.label}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 inline-flex items-center text-xs font-black uppercase tracking-[0.25em] text-red-400 transition group-hover:text-red-300">
                                        Entrar al panel
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </main>
        </div>
    );
}

import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react"; // Añadimos usePage
import Sidebar from "@/Components/PanelAdminEcommerce/Sidebar";
import { Home } from "lucide-react";
import { useAdminRoutes } from "@/Utils/adminRoutes";
import { buildUnifiedAdminMenu } from "@/Utils/adminMenu";

// Importamos el CSS específico del panel
// Nota: En Vite, esto puede requerir configuración adicional si no es global,
// pero al ser CSS puro importado en JS suele funcionar.
import "../../../css/panel.css";

export default function PanelLayout({
    title,
    activeItem,
    children,
    menuItems = null,
    homeRoute = "home",
    showGamingShortcut = true,
    shortcutLink = "/paneladmingaming",
    shortcutLabel = "Administrar Gaming",
}) {
    const { menu_admin, auth } = usePage().props; // Atrapamos el menú y el user del servidor
    const { isSuperAdmin, routeUrl } = useAdminRoutes();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isAdmin = auth?.user?.rol === "admin";
    const resolvedMenuItems = isSuperAdmin
        ? buildUnifiedAdminMenu(routeUrl)
        : menuItems ?? menu_admin;

    // Usamos auth.user usando las propiedades correctas de TierOne (username, rol)
    const userDisplay = auth.user || {
        username: "Admin",
        rol: "admin",
        avatar: "A",
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="panel-body">
            {" "}
            {/* Clase wrapper para estilos específicos */}
            <Head title={title} />
            {/* SIDEBAR */}
            <Sidebar
                menuItems={resolvedMenuItems}
                activeItem={activeItem}
                user={userDisplay}
                isSidebarOpen={isSidebarOpen}
                homeLink={isSuperAdmin ? route("panel.superadmin.index") : route("panel.ecommerce.dashboard")}
            />
            {/* SIDEBAR OVERLAY */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            {/* HEADER */}
            <header className="panel-header">
                {" "}
                {/* Renombrado a panel-header en CSS para evitar conflicto global */}
                <div className="header-left">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        ☰
                    </button>
                    <h1 className="page-title italic font-['Outfit']">{title}</h1>
                </div>
                <div className="header-actions">
                    {isAdmin && !isSuperAdmin && (
                        <Link href={route("panel.superadmin.index")} className="btn-secondary">
                            <span>Super Admin</span>
                        </Link>
                    )}
                    {isAdmin && !isSuperAdmin && showGamingShortcut && (
                        <Link href={shortcutLink} className="btn-secondary">
                            <span>{shortcutLabel}</span>
                        </Link>
                    )}
                    <Link
                        href={route(homeRoute)}
                        className="btn-secondary"
                    >
                        <Home size={16} />
                        <span>Volver a la Web</span>
                    </Link>
                </div>
            </header>
            {/* MAIN CONTENT */}
            <main className="main-content">{children}</main>
        </div>
    );
}

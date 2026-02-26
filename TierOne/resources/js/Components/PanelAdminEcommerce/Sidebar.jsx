import { Link } from "@inertiajs/react";
import * as Lucide from "lucide-react";

export default function Sidebar({
    menuItems,
    activeItem,
    user,
    isSidebarOpen,
}) {
    // Función para renderizar el icono dinámicamente
    const renderIcon = (iconName) => {
        const IconComponent = Lucide[iconName];
        return IconComponent ? <IconComponent size={18} /> : null;
    };

    return (
        <aside
            className={`sidebar ${isSidebarOpen ? "active" : ""}`}
            id="sidebar"
        >
            <Link
                href={route("panel.ecommerce.dashboard")}
                className="logo-sidebar group"
            >
                <span className="group-hover:opacity-80 transition-opacity uppercase tracking-[0.2em] font-black text-white">
                    TIERONE
                </span>
            </Link>

            <nav>
                {menuItems.map((section, index) => (
                    <div key={index} className="nav-section">
                        {section.title && (
                            <div className="nav-section-title">
                                {section.title}
                            </div>
                        )}

                        {section.items.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.link || "#"}
                                className={`nav-item ${activeItem === item.label ? "active" : ""}`}
                            >
                                <span className="icon">
                                    {renderIcon(item.icon)}
                                </span>
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="badge">{item.badge}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="user-profile">
                <div className="user-avatar">
                    {user?.avatar ||
                        (user?.username || user?.nombre || "?")
                            .charAt(0)
                            .toUpperCase()}
                </div>
                <div className="user-info">
                    <div className="user-name">
                        {user?.username || user?.nombre || "Admin"}
                    </div>
                    <div className="user-role tracking-widest uppercase text-[8px] font-black opacity-50">
                        {user?.rol || "admin"}
                    </div>
                </div>
            </div>
        </aside>
    );
}

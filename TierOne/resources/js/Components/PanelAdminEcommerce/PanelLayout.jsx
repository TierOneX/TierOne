
import { useState } from 'react';
import { Head, Link } from '@inertiajs/react'; // Importamos Inertia Link por si acaso
import Sidebar from '@/Components/PanelAdminEcommerce/Sidebar';

// Importamos el CSS específico del panel
// Nota: En Vite, esto puede requerir configuración adicional si no es global, 
// pero al ser CSS puro importado en JS suele funcionar.
import '../../../css/panel.css';

export default function PanelLayout({ title, menuItems, activeItem, user, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="panel-body"> {/* Clase wrapper para estilos específicos */}
            <Head title={title} />

            {/* SIDEBAR */}
            <Sidebar
                menuItems={menuItems}
                activeItem={activeItem}
                user={user}
                isSidebarOpen={isSidebarOpen}
            />

            {/* SIDEBAR OVERLAY */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* HEADER */}
            <header className="panel-header"> {/* Renombrado a panel-header en CSS para evitar conflicto global */}
                <div className="header-left">
                    <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
                    <h1 className="page-title">{title}</h1>
                </div>
                <div className="header-actions">
                    <button className="btn-icon">
                        🔔
                        <span className="notification-dot"></span>
                    </button>
                    <button className="btn-secondary">
                        📤 Exportar
                    </button>
                    <button className="btn-primary">
                        + Nuevo Producto
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

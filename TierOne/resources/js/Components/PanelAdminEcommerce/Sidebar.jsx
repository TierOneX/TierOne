
import { Link } from '@inertiajs/react';

export default function Sidebar({ menuItems, activeItem, user, isSidebarOpen }) {
    return (
        <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`} id="sidebar">
            <Link href={route('panel.ecommerce.dashboard')} className="logo-sidebar group">
                <span className="group-hover:opacity-80 transition-opacity">TIERONE</span>
            </Link>

            <nav>
                {/* Agrupamos los items si tienen 'section' definida, si no, los mostramos directos. 
                    Para simplificar basado en el array plano del ejemplo: */}

                {menuItems.map((section, index) => (
                    <div key={index} className="nav-section">
                        {section.title && (
                            <div className="nav-section-title">{section.title}</div>
                        )}

                        {section.items.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.link || '#'}
                                className={`nav-item ${activeItem === item.label ? 'active' : ''}`}
                            >
                                <span className="icon">{item.icon}</span>
                                <span>{item.label}</span>
                                {item.badge && <span className="badge">{item.badge}</span>}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="user-profile">
                <div className="user-avatar">
                    {user.avatar || user.name.charAt(0)}
                </div>
                <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role">{user.role}</div>
                </div>
            </div>
        </aside>
    );
}

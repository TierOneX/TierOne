
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';

export default function PanelAdminEcommerce() {

    // Configuración del Menú para este panel específico
    const menuItems = [
        {
            title: 'Catálogo',
            items: [
                { label: 'Productos', icon: '📦', link: '#' },
                { label: 'Categorías', icon: '🏷️', link: '#' }
            ]
        },
        {
            title: 'Ventas',
            items: [
                { label: 'Órdenes', icon: '📋', link: '#', badge: '4' }, // Active Item
                { label: 'Clientes', icon: '👥', link: '#' }
            ]
        },
        {
            title: 'Logística',
            items: [
                { label: 'Proveedores', icon: '🚚', link: '#' },
                { label: 'Inventario', icon: '📊', link: '#' }
            ]
        },
        {
            title: 'Sistema',
            items: [
                { label: 'Notificaciones', icon: '🔔', link: '#' },
                { label: 'Configuración', icon: '⚙️', link: '#' }
            ]
        }
    ];

    const user = {
        name: 'Admin User',
        role: 'Ecommerce Admin',
        avatar: 'A'
    };


    return (
        <PanelLayout
            title="Dashboard Ecommerce"
            menuItems={menuItems}
            activeItem="Órdenes"
            user={user}
        >
            {/* STATS */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon green">$</div>
                        <button className="stat-menu">⋯</button>
                    </div>
                    <div className="stat-value">€24,580</div>
                    <div className="stat-label">Ventas del Mes</div>
                    <div className="stat-change positive">
                        ↑ 18% vs mes anterior
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon blue">📦</div>
                        <button className="stat-menu">⋯</button>
                    </div>
                    <div className="stat-value">142</div>
                    <div className="stat-label">Órdenes Activas</div>
                    <div className="stat-note">8 pendientes de envío</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon purple">👕</div>
                        <button className="stat-menu">⋯</button>
                    </div>
                    <div className="stat-value">1,248</div>
                    <div className="stat-label">Productos Activos</div>
                    <div className="stat-change positive">
                        + 24 nuevos esta semana
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-header">
                        <div className="stat-icon orange">⚠️</div>
                        <button className="stat-menu">⋯</button>
                    </div>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Stock Bajo</div>
                    <div className="stat-note">Requieren reposición</div>
                </div>
            </div>

            {/* RECENT ORDERS */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">
                        📦 Órdenes Recientes
                    </h2>
                    <a href="#" className="section-link">Ver todas</a>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ORDEN</th>
                                <th>CLIENTE</th>
                                <th>PRODUCTOS</th>
                                <th>TOTAL</th>
                                <th>ESTADO</th>
                                <th>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>#ORD-2401</strong></td>
                                <td>
                                    <div className="client-info">
                                        <div className="client-avatar">JD</div>
                                        <span>John Doe</span>
                                    </div>
                                </td>
                                <td>3 items</td>
                                <td><strong>€89.97</strong></td>
                                <td><span className="status-badge pending">Pendiente</span></td>
                                <td><button className="btn-table">Ver</button></td>
                            </tr>
                            <tr>
                                <td><strong>#ORD-2400</strong></td>
                                <td>
                                    <div className="client-info">
                                        <div className="client-avatar">MS</div>
                                        <span>María Silva</span>
                                    </div>
                                </td>
                                <td>1 item</td>
                                <td><strong>€45.00</strong></td>
                                <td><span className="status-badge sent">Enviado</span></td>
                                <td><button class="btn-table">Ver</button></td>
                            </tr>
                            <tr>
                                <td><strong>#ORD-2399</strong></td>
                                <td>
                                    <div className="client-info">
                                        <div className="client-avatar">PG</div>
                                        <span>Pedro García</span>
                                    </div>
                                </td>
                                <td>5 items</td>
                                <td><strong>€124.50</strong></td>
                                <td><span className="status-badge completed">Completado</span></td>
                                <td><button className="btn-table">Ver</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </PanelLayout>
    );
}

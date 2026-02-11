
# Panel Admin Ecommerce Components

Este directorio contiene los componentes modulares para el panel de administración.

## Arquitectura

El diseño se basa en **componentes reutilizables** para permitir la creación futura de otros paneles (ej. Panel de Usuario, Panel de Torneos) reutilizando la misma estructura visual (Layout y Sidebar).

### 1. PanelLayout.jsx
Es el contenedor principal (`Wrapper`).
- **Función**: Maneja la estructura general de la página (Sidebar a la izquierda, Contendido a la derecha).
- **Responsabilidad**:
    - Controla el estado del Sidebar en móvil (abierto/cerrado).
    - Renderiza el `Sidebar`.
    - Renderiza el `Header` (barra superior).
    - Renderiza el contenido hijo (`children`) dentro del área principal.

### 2. Sidebar.jsx
Es el menú de navegación lateral.
- **Props**:
    - `menuItems`: Array de objetos que define las opciones del menú.
    - `activeItem`: Identificador de la opción actual.
- **Reutilización**: Para crear un nuevo panel, solo necesitas pasarle un array `menuItems` diferente.

### 3. Componentes Específicos
- `StatsGrid.jsx`: Muestra las tarjetas de estadísticas.
- `RecentOrders.jsx`: Tabla de órdenes.
- `InventoryAlerts.jsx`: Lista de alertas.

## Cómo usar en una nueva página

```jsx
import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';

const menuItems = [
    { label: 'Dashboard', icon: '...', link: '/dashboard' },
    { label: 'Settings', icon: '...', link: '/settings' },
];

export default function NewPanel() {
    return (
        <PanelLayout 
            title="Mi Nuevo Panel" 
            menuItems={menuItems} 
            activeItem="Dashboard"
            user={{ name: "Admin", role: "Super Admin" }}
        >
            <h1>Contenido del Panel</h1>
        </PanelLayout>
    );
}
```

import PanelLayout from '@/Components/PanelAdminEcommerce/PanelLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Products() {
    // Mock Product Data
    const [products, setProducts] = useState([
        { id: 1, name: 'TierOne Pro Jersey', category: 'Jerseys', price: 85.00, stock: 120, status: 'Active', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop' },
        { id: 2, name: 'Stealth Bomber Jacket', category: 'Hoodies', price: 150.00, stock: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop' },
        { id: 3, name: 'Elite Joggers', category: 'Bottoms', price: 75.00, stock: 8, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop' },
        { id: 4, name: 'Championship Cap', category: 'Headwear', price: 35.00, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop' },
    ]);

    // Configuración del Menú (Simulada, idealmente vendría de un contexto o prop layout)
    const menuItems = [
        { title: 'Catálogo', items: [{ label: 'Productos', icon: '📦', link: route('panel.ecommerce.products') }, { label: 'Categorías', icon: '🏷️', link: '#' }] },
        { title: 'Ventas', items: [{ label: 'Órdenes', icon: '📋', link: route('panel.ecommerce.orders'), badge: '4' }, { label: 'Clientes', icon: '👥', link: '#' }] },
        { title: 'Logística', items: [{ label: 'Proveedores', icon: '🚚', link: '#' }, { label: 'Inventario', icon: '📊', link: '#' }] },
        { title: 'Sistema', items: [{ label: 'Reportes', icon: '⚠️', link: route('panel.ecommerce.reports') }, { label: 'Configuración', icon: '⚙️', link: '#' }] }
    ];

    const user = { name: 'Admin User', role: 'Ecommerce Admin', avatar: 'A' };

    return (
        <PanelLayout title="Gestión de Productos" menuItems={menuItems} activeItem="Productos" user={user}>
            <Head title="Products - Admin Panel" />

            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4">
                    <input type="text" placeholder="Buscar producto..." className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500" />
                    <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                        <option>Categoría: Todas</option>
                        <option>Jerseys</option>
                        <option>Hoodies</option>
                    </select>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <span>+</span> Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Categoría</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.stock} units</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 text-gray-400 hover:text-blue-600">✏️</button>
                                        <button className="p-1 text-gray-400 hover:text-red-600">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4 px-2">
                <span className="text-sm text-gray-500">Mostrando 4 de 24 productos</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50" disabled>Anterior</button>
                    <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">Siguiente</button>
                </div>
            </div>
        </PanelLayout>
    );
}

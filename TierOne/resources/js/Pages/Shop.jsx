import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ShopHero from '@/Components/Shop/ShopHero';
import SearchBar from '@/Components/Shop/SearchBar';
import CategoryFilter from '@/Components/Shop/CategoryFilter';
import ProductGrid from '@/Components/Shop/ProductGrid';

const SORT_OPTIONS = [
    { value: 'default', label: 'Relevancia' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'sales', label: 'Más vendidos' },
    { value: 'name', label: 'Nombre A-Z' },
];

export default function Shop({ productos = [], categorias = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [onlyFeatured, setOnlyFeatured] = useState(false);

    // Construir la lista de categorías a partir de los datos del servidor
    const categoryNames = useMemo(() => {
        const names = categorias.map((cat) => cat.nombre.toUpperCase());
        return ['TODOS', ...names];
    }, [categorias]);

    // Filtrado y ordenación de productos
    const filteredProducts = useMemo(() => {
        let result = productos.filter((producto) => {
            const matchesCategory =
                activeCategory === 'TODOS' ||
                producto.categoria?.nombre?.toUpperCase() === activeCategory;

            const matchesSearch =
                searchTerm === '' ||
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (producto.categoria?.nombre && producto.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesFeatured = !onlyFeatured || producto.destacado;

            return matchesCategory && matchesSearch && matchesFeatured;
        });

        // Ordenación
        switch (sortBy) {
            case 'price_asc':
                result = [...result].sort((a, b) => parseFloat(a.precio_venta) - parseFloat(b.precio_venta));
                break;
            case 'price_desc':
                result = [...result].sort((a, b) => parseFloat(b.precio_venta) - parseFloat(a.precio_venta));
                break;
            case 'rating':
                result = [...result].sort((a, b) => parseFloat(b.rating_promedio) - parseFloat(a.rating_promedio));
                break;
            case 'sales':
                result = [...result].sort((a, b) => b.ventas_totales - a.ventas_totales);
                break;
            case 'name':
                result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            default:
                break;
        }

        return result;
    }, [productos, activeCategory, searchTerm, sortBy, onlyFeatured]);

    return (
        <MainLayout>
            <Head title="Tienda - TierOne" />
            <Head>
                <meta name="description" content="Tienda oficial TierOne Gaming. Periféricos, componentes, merchandising y más. Envío rápido y productos de calidad." />
            </Head>

            {/* 1. Hero */}
            <ShopHero />

            {/* 2. Buscador + Filtros de categoría */}
            <section className="bg-[#0a0a0a] px-4 pb-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onToggleFilter={() => setShowFilter(!showFilter)}
                        isFilterOpen={showFilter}
                    />

                    {/* Panel de filtros desplegable */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilter ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
                            {/* Categorías */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">
                                    Categoría
                                </label>
                                <CategoryFilter
                                    categories={categoryNames}
                                    activeCategory={activeCategory}
                                    onCategoryChange={setActiveCategory}
                                />
                            </div>

                            {/* Ordenar por */}
                            <div className="pt-2 border-t border-white/5">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">
                                    Ordenar por
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SORT_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${sortBy === option.value
                                                ? 'bg-red-600 text-white border-red-600'
                                                : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filtros adicionales */}
                            <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={onlyFeatured}
                                            onChange={(e) => setOnlyFeatured(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 rounded-full bg-gray-700 peer-checked:bg-red-600 transition-colors" />
                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                                        Solo destacados
                                    </span>
                                </label>

                                {/* Botón limpiar filtros */}
                                <button
                                    onClick={() => {
                                        setSortBy('default');
                                        setOnlyFeatured(false);
                                        setSearchTerm('');
                                        setActiveCategory('TODOS');
                                    }}
                                    className="text-sm text-gray-500 hover:text-red-500 transition-colors underline underline-offset-2 ml-auto"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Grid de productos */}
            <ProductGrid
                productos={filteredProducts}
                totalCount={productos.length}
            />
        </MainLayout>
    );
}

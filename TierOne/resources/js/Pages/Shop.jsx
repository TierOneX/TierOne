import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ShopHero from '@/Components/Shop/ShopHero';
import SearchBar from '@/Components/Shop/SearchBar';
import CategoryFilter from '@/Components/Shop/CategoryFilter';
import ProductGrid from '@/Components/Shop/ProductGrid';

export default function Shop({ productos = [], categorias = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [showFilter, setShowFilter] = useState(false);

    // Construir la lista de categorías a partir de los datos del servidor
    const categoryNames = useMemo(() => {
        const names = categorias.map((cat) => cat.nombre.toUpperCase());
        return ['TODOS', ...names];
    }, [categorias]);

    // Filtrado de productos por categoría y búsqueda
    const filteredProducts = useMemo(() => {
        return productos.filter((producto) => {
            const matchesCategory =
                activeCategory === 'TODOS' ||
                producto.categoria?.nombre?.toUpperCase() === activeCategory;

            const matchesSearch =
                searchTerm === '' ||
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (producto.categoria?.nombre && producto.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [productos, activeCategory, searchTerm]);

    return (
        <MainLayout>
            <Head title="Tienda - TierOne" />
            <Head>
                <meta name="description" content="Tienda oficial TierOne Gaming. Periféricos, componentes, merchandising y más. Envío rápido y productos de calidad." />
            </Head>

            {/* 1. Hero */}
            <ShopHero />

            {/* 2. Buscador + Filtros de categoría */}
            <section className="bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a] px-4 pb-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onToggleFilter={() => setShowFilter(!showFilter)}
                    />
                    <CategoryFilter
                        categories={categoryNames}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
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

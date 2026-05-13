import { Head, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import MainLayout from "@/Layouts/MainLayout";
import ShopHero from "@/Components/Shop/ShopHero";
import SearchBar from "@/Components/Shop/SearchBar";
import CategoryFilter from "@/Components/Shop/CategoryFilter";
import ProductGrid from "@/Components/Shop/ProductGrid";
import HydraPacks from "@/Components/Shop/HydraPacks";

const SORT_OPTIONS = [
    { value: "default", label: "Relevancia" },
    { value: "price_asc", label: "Precio: menor a mayor" },
    { value: "price_desc", label: "Precio: mayor a menor" },
    { value: "rating", label: "Mejor valorados" },
    { value: "sales", label: "Más vendidos" },
    { value: "name", label: "Nombre A-Z" },
];

const imgUrl = (src) => {
    if (!src) return "/images/placeholder.jpg";
    return src.startsWith("/") || src.startsWith("http") ? src : `/${src}`;
};

export default function Shop({ productos = [], categorias = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("TODOS");
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [onlyFeatured, setOnlyFeatured] = useState(false);

    // Construir la lista de categorías a partir de los datos del servidor
    const categoryNames = useMemo(() => {
        const names = categorias.map((cat) => cat.nombre.toUpperCase());
        return ["TODOS", ...names];
    }, [categorias]);

    // Filtrado y ordenación de productos
    const filteredProducts = useMemo(() => {
        let result = productos.filter((producto) => {
            const matchesCategory =
                activeCategory === "TODOS" ||
                producto.categoria?.nombre?.toUpperCase() === activeCategory;

            const matchesSearch =
                searchTerm === "" ||
                producto.nombre
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (producto.descripcion &&
                    producto.descripcion
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (producto.categoria?.nombre &&
                    producto.categoria.nombre
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            const matchesFeatured = !onlyFeatured || producto.destacado;

            return matchesCategory && matchesSearch && matchesFeatured;
        });

        // Ordenación
        switch (sortBy) {
            case "price_asc":
                result = [...result].sort(
                    (a, b) =>
                        parseFloat(a.precio_venta) - parseFloat(b.precio_venta),
                );
                break;
            case "price_desc":
                result = [...result].sort(
                    (a, b) =>
                        parseFloat(b.precio_venta) - parseFloat(a.precio_venta),
                );
                break;
            case "rating":
                result = [...result].sort(
                    (a, b) =>
                        parseFloat(b.rating_promedio) -
                        parseFloat(a.rating_promedio),
                );
                break;
            case "sales":
                result = [...result].sort(
                    (a, b) => b.ventas_totales - a.ventas_totales,
                );
                break;
            case "name":
                result = [...result].sort((a, b) =>
                    a.nombre.localeCompare(b.nombre),
                );
                break;
            default:
                break;
        }

        return result;
    }, [productos, activeCategory, searchTerm, sortBy, onlyFeatured]);

    const featuredProducts = useMemo(() => {
        return productos.filter(p => p.destacado).slice(0, 4);
    }, [productos]);

    return (
        <MainLayout>
            <Head title="Tienda - TierOne" />
            <Head>
                <meta
                    name="description"
                    content="Tienda oficial TierOne Gaming. Periféricos, componentes, merchandising y más. Envío rápido y productos de calidad."
                />
            </Head>

            {/* 1. Featured Products Section */}
            <section className="relative overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(227,24,55,0.36),_transparent_52%),radial-gradient(circle_at_78%_22%,_rgba(227,24,55,0.18),_transparent_46%),linear-gradient(180deg,_#151515_0%,_#090909_100%)] px-4 pb-20 pt-24 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="mb-12">
                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-red-500">TierOne Selection</p>
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Productos <span className="text-red-600">Destacados</span></h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Link 
                                key={product.id}
                                href={route('product.show', product.slug || product.id)}
                                className="group relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-red-500/50"
                            >
                                <img 
                                    src={imgUrl(product.imagen_principal || product.imagen_url_local)} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" 
                                    alt={product.nombre} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">{product.categoria?.nombre || 'Producto'}</p>
                                    <h3 className="text-xl font-black text-white uppercase italic leading-tight mb-3 truncate">{product.nombre}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-black text-white">
                                            {parseFloat(product.precio_venta).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                        </p>
                                        <div className="px-4 py-2 rounded-xl bg-red-600 text-[10px] font-black text-white uppercase tracking-widest transition-all group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                                            Ver más
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Hydra Coins Packs */}
            <HydraPacks />

            {/* 3. Buscador + Filtros de categoría */}
            <section className="bg-[#0a0a0a] px-4 pb-8 pt-12">
                <div className="max-w-7xl mx-auto space-y-6">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onToggleFilter={() => setShowFilter(!showFilter)}
                        isFilterOpen={showFilter}
                    />

                    {/* Panel de filtros desplegable */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            showFilter
                                ? "max-h-[800px] opacity-100"
                                : "max-h-0 opacity-0"
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
                                            onClick={() =>
                                                setSortBy(option.value)
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                                                sortBy === option.value
                                                    ? "bg-red-600 text-white border-red-600"
                                                    : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
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
                                            onChange={(e) =>
                                                setOnlyFeatured(
                                                    e.target.checked,
                                                )
                                            }
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
                                        setSortBy("default");
                                        setOnlyFeatured(false);
                                        setSearchTerm("");
                                        setActiveCategory("TODOS");
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

            {/* 4. Grid de productos */}
            <ProductGrid
                productos={filteredProducts}
                totalCount={productos.length}
            />
        </MainLayout>
    );
}

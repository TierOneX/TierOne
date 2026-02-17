export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
                <button
                    key={category}
                    id={`category-pill-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onCategoryChange(category)}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${activeCategory === category
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

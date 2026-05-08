import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import TournamentsHero from '@/Components/Tournaments/TournamentsHero';
import TournamentsGameGrid from '@/Components/Tournaments/TournamentsGameGrid';
import TournamentsDrawer from '@/Components/Tournaments/TournamentsDrawer';

export default function Tournaments({ juegos = [], categorias = [] }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [selectedGameId, setSelectedGameId] = useState(null);

    const filteredGames = useMemo(() => {
        return juegos.filter((game) => {
            const matchesCategory = activeCategory === 'TODOS' || game.categoria === activeCategory;
            const needle = searchTerm.trim().toLowerCase();
            const matchesSearch =
                needle.length === 0 ||
                game.nombre.toLowerCase().includes(needle) ||
                game.categoria.toLowerCase().includes(needle) ||
                (game.descripcion ?? '').toLowerCase().includes(needle);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, juegos, searchTerm]);

    const featuredGames = useMemo(() => {
        const source = activeCategory === 'TODOS'
            ? juegos
            : juegos.filter((game) => game.categoria === activeCategory);

        return source.slice(0, 4);
    }, [activeCategory, juegos]);

    const selectedGame = useMemo(
        () => juegos.find((game) => game.id === selectedGameId) ?? null,
        [juegos, selectedGameId],
    );

    return (
        <MainLayout>
            <Head title="Torneos" />

            {flash?.success && !selectedGame && (
                <div className="px-4 pt-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-[1400px] rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                        {flash.success}
                    </div>
                </div>
            )}

            {flash?.error && !selectedGame && (
                <div className="px-4 pt-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-[1400px] rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                        {flash.error}
                    </div>
                </div>
            )}

            <TournamentsHero
                featuredGames={featuredGames}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categories={categorias}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalGames={filteredGames.length}
                onSelectGame={(game) => setSelectedGameId(game.id)}
            />

            <TournamentsGameGrid
                games={filteredGames}
                selectedGameId={selectedGameId}
                onSelectGame={(game) => setSelectedGameId(game.id)}
            />

            <TournamentsDrawer
                isOpen={Boolean(selectedGame)}
                game={selectedGame}
                onClose={() => setSelectedGameId(null)}
            />
        </MainLayout>
    );
}

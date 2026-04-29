import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import MatchesHero from '@/Components/Matches/MatchesHero';
import MatchesSearchBar from '@/Components/Matches/MatchesSearchBar';
import MatchesGameGrid from '@/Components/Matches/MatchesGameGrid';
import MatchesDrawer from '@/Components/Matches/MatchesDrawer';

export default function Matches({ juegos = [], categorias = [], demoUser = null }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [selectedGame, setSelectedGame] = useState(null);

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

    const popularGames = useMemo(() => {
        const source = activeCategory === 'TODOS'
            ? juegos
            : juegos.filter((game) => game.categoria === activeCategory);

        return source.slice(0, 4);
    }, [activeCategory, juegos]);

    return (
        <MainLayout>
            <Head title="Partidas" />
            <Head>
                <meta
                    name="description"
                    content="Explora juegos competitivos, consulta salas abiertas y crea nuevas partidas desde el panel de matchmaking de TierOne."
                />
            </Head>

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

            <MatchesHero
                popularGames={popularGames}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categories={categorias}
            />

            <MatchesSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalGames={filteredGames.length}
            />

            <MatchesGameGrid
                games={filteredGames}
                selectedGameId={selectedGame?.id}
                onSelectGame={setSelectedGame}
            />

            <MatchesDrawer
                isOpen={Boolean(selectedGame)}
                game={selectedGame}
                games={juegos}
                demoUser={demoUser}
                onClose={() => setSelectedGame(null)}
            />
        </MainLayout>
    );
}

import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import MatchesHero from '@/Components/Matches/MatchesHero';
import MatchesGameGrid from '@/Components/Matches/MatchesGameGrid';
import MatchesDrawer from '@/Components/Matches/MatchesDrawer';
import MyMatchesSection from '@/Components/Matches/MyMatchesSection';

export default function Matches({ juegos = [], categorias = [] }) {
    const { auth, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [drawerTab, setDrawerTab] = useState('list');

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

    const selectedGame = useMemo(
        () => juegos.find((game) => game.id === selectedGameId) ?? null,
        [juegos, selectedGameId],
    );

    const myMatches = useMemo(() => {
        if (!auth?.user) {
            return [];
        }

        return juegos.flatMap((game) =>
            (game.partidas ?? [])
                .filter((match) =>
                    match.creador?.username === auth.user.username ||
                    (match.participantes ?? []).some((participant) => participant.id_usuario === auth.user.id),
                )
                .map((match) => ({
                    ...match,
                    juego: {
                        id: game.id,
                        nombre: game.nombre,
                        imagen_url: game.imagen_url,
                        categoria: game.categoria,
                    },
                })),
        );
    }, [auth?.user, juegos]);

    const isDrawerActionFlash = [
        'Partida creada correctamente.',
        'Te has unido a la partida correctamente.',
    ].includes(flash?.success);

    const openGameDrawer = (gameOrId, tab = 'list') => {
        setSelectedGameId(typeof gameOrId === 'object' ? gameOrId.id : gameOrId);
        setDrawerTab(tab);
    };

    return (
        <MainLayout>
            <Head title="Partidas" />
            <Head>
                <meta
                    name="description"
                    content="Explora juegos competitivos, consulta salas abiertas y crea nuevas partidas desde el panel de matchmaking de TierOne."
                />
            </Head>

            {flash?.success && !selectedGame && !isDrawerActionFlash && (
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
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalGames={filteredGames.length}
                onSelectGame={(game) => openGameDrawer(game, 'list')}
                onJoinGame={(game) => openGameDrawer(game, 'list')}
                onCreateGame={(game) => openGameDrawer(game, 'create')}
            />

            <MatchesGameGrid
                games={filteredGames}
                selectedGameId={selectedGameId}
                onSelectGame={(game) => openGameDrawer(game, 'list')}
            />

            <MyMatchesSection
                matches={myMatches}
                isAuthenticated={Boolean(auth?.user)}
                onOpenGame={(gameId) => openGameDrawer(gameId, 'list')}
            />

            <MatchesDrawer
                isOpen={Boolean(selectedGame)}
                game={selectedGame}
                games={juegos}
                initialTab={drawerTab}
                onClose={() => setSelectedGameId(null)}
            />
        </MainLayout>
    );
}

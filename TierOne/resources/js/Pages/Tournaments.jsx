import { Head, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TournamentsHero from "@/Components/Tournaments/TournamentsHero";
import TournamentsGameGrid from "@/Components/Tournaments/TournamentsGameGrid";
import TournamentsDrawer from "@/Components/Tournaments/TournamentsDrawer";
import MyTournamentsSection from "@/Components/Tournaments/MyTournamentsSection";
import SponsorTriangle from "@/Components/SponsorTriangle";

export default function Tournaments({ juegos = [], categorias = [], myTournaments = [] }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("TODOS");
    const [selectedGameId, setSelectedGameId] = useState(null);

    useEffect(() => {
        const tournamentId = new URLSearchParams(window.location.search).get("torneo");
        if (!tournamentId) return;

        const gameWithTournament = juegos.find((game) =>
            game.torneos?.some((torneo) => String(torneo.id) === tournamentId),
        );

        if (gameWithTournament) {
            setSelectedGameId(gameWithTournament.id);
        }
    }, [juegos]);

    const filteredGames = useMemo(() => {
        return juegos.filter((game) => {
            const matchesCategory =
                activeCategory === "TODOS" || game.categoria === activeCategory;
            const needle = searchTerm.trim().toLowerCase();
            const matchesSearch =
                needle.length === 0 ||
                game.nombre.toLowerCase().includes(needle) ||
                game.categoria.toLowerCase().includes(needle) ||
                (game.descripcion ?? "").toLowerCase().includes(needle);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, juegos, searchTerm]);

    const featuredGames = useMemo(() => {
        const source =
            activeCategory === "TODOS"
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

            <TournamentsHero
                featuredGames={featuredGames}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categories={categorias}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalGames={filteredGames.length}
                onSelectGame={(game) => setSelectedGameId(game.id)}
                isAdmin={auth?.user?.rol === "admin"}
            />

            <div className="border-b border-white/5">
                <MyTournamentsSection
                    tournaments={myTournaments}
                    isAuthenticated={Boolean(auth?.user)}
                    onOpenTournament={(gameId) => setSelectedGameId(gameId)}
                />
            </div>

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

            <SponsorTriangle />
        </MainLayout>
    );
}

import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import BannerCarousel from '@/Components/Home/BannerCarousel';
import GamesCarousel from '@/Components/Home/GamesCarousel';
import MerchSection from '@/Components/Home/MerchSection';
import TournamentsSection from '@/Components/Home/TournamentsSection';

export default function Home({ games, products, tournaments }) {
    return (
        <>
            <Head title="Inicio - TierOne Gaming" />
            <Head>
                <meta name="description" content="TierOne - Tu plataforma de gaming competitivo. Torneos, partidas en vivo, merchandising exclusivo y una comunidad de ├®lite." />
            </Head>

            <div className="min-h-screen" style={{ background: '#0B0B0B', color: '#ffffff' }}>
                <Header />
                <div className="h-16" />

                {/* 1. Banner Carrusel */}
                <BannerCarousel />

                {/* 2. Juegos - Carrusel horizontal */}
                <GamesCarousel games={games} />

                {/* 3. Merchandising */}
                <MerchSection products={products} />

                {/* 4. Torneos pr├│ximos */}
                <TournamentsSection tournaments={tournaments} />

                <Footer />
            </div>
        </>
    );
}

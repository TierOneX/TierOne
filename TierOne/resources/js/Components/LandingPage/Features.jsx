import { Link } from '@inertiajs/react';

export default function Features() {

    const features = [
        {
            id: 'partidas',
            url: '/matches',
            sectionTitle: 'PARTIDAS CLASIFICATORIAS',
            title: 'COMPITE EN TIEMPO REAL',
            description: 'Únete a partidas clasificatorias en tiempo real contra jugadores de tu nivel. Sistema de matchmaking inteligente que te empareja con rivales equilibrados.',
            image: '/images/landing/Partidas.jpg',
            items: [
                'Matchmaking automático por nivel',
                'Rankings y estadísticas en vivo',
                'Transmisiones de partidas destacadas',
                'Sistema anti-trampas activo'
            ]
        },
        {
            id: 'torneos',
            url: '/tournaments',
            sectionTitle: 'TORNEOS Y COMPETICIONES',
            title: 'EVENTOS COMPETITIVOS',
            description: 'Compite por premios en efectivo en torneos organizados semanalmente. Desde ligas amateur hasta competiciones profesionales con premios de hasta 10.000€.',
            image: '/images/landing/torneos.jpg',
            items: [
                'Torneos semanales y mensuales',
                'Premios en efectivo garantizados',
                'Sistema de brackets automático',
                'Transmisión oficial de finales'
            ]
        },
        {
            id: 'rankings',
            url: '/community',
            sectionTitle: 'CLASIFICACIÓN GLOBAL',
            title: 'SISTEMA DE RANKINGS',
            description: 'Sistema de ranking dinámico basado en MMR (Match Making Rating). Cada victoria te acerca a la cima, cada derrota te reta a mejorar.',
            image: './img/imgRanking.jpg',
            items: [
                'Sistema MMR transparente y justo',
                'Temporadas competitivas mensuales',
                'Recompensas por posición final',
                'Múltiples divisiones y rangos'
            ]
        },
        {
            id: 'tienda',
            url: '/shop',
            sectionTitle: 'NUESTRA TIENDA',
            title: 'MERCHANDISING EXCLUSIVO',
            description: 'Descubre nuestra colección oficial de merchandising gaming. Camisetas, sudaderas, gorras y accesorios diseñados para verdaderos competidores.',
            image: 'merchandising-imagen.jpg',
            items: [
                'Productos oficiales de calidad',
                'Diseños exclusivos limitados',
                'Envío rápido en 24-48h',
                'Descuentos para miembros VIP'
            ]
        }
    ];

    return (
        <div className="features-container">
            {features.map((feature, index) => (
                <FeatureSection
                    key={index}
                    {...feature}
                    isReversed={index % 2 !== 0}
                />
            ))}
        </div>
    );
}

function FeatureSection({ id, url, title, description, image, items, sectionTitle, isReversed }) {
    return (
        <section
            id={id}
            className={`feature-bg-section ${isReversed ? 'is-reversed' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="section-overlay"></div>
            <div className="feature-container">
                <div className="feature-text-content">
                    <span className="section-label">{sectionTitle}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <ul className="feature-list">
                        {items.map((item, idx) => (
                            <li key={idx}><span className="check">✓</span> {item}</li>
                        ))}
                    </ul>
                    <Link href={url} className="feature-cta">
                        EXPLORAR MÁS <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}


export default function Features() {

    const features = [
        {
            id: 'partidas',
            sectionTitle: 'PARTIDAS CLASIFICATORIAS',
            title: 'COMPITE EN TIEMPO REAL',
            description: 'Únete a partidas clasificatorias en tiempo real contra jugadores de tu nivel. Sistema de matchmaking inteligente que te empareja con rivales equilibrados.',
            image: './img/imgPartidas.webp',
            reverse: false,
            style: {},
            items: [
                'Matchmaking automático por nivel',
                'Rankings y estadísticas en vivo',
                'Transmisiones de partidas destacadas',
                'Sistema anti-trampas activo'
            ]
        },
        {
            id: 'torneos',
            sectionTitle: 'TORNEOS Y COMPETICIONES',
            title: 'EVENTOS COMPETITIVOS',
            description: 'Compite por premios en efectivo en torneos organizados semanalmente. Desde ligas amateur hasta competiciones profesionales con premios de hasta 10.000€.',
            image: './img/imgTorneo.jpg',





































            reverse: true,
            style: { background: 'var(--surface)' },
            items: [
                'Torneos semanales y mensuales',
                'Premios en efectivo garantizados',
                'Sistema de brackets automático',
                'Transmisión oficial de finales'
            ]
        },
        {
            id: 'rankings',
            sectionTitle: 'CLASIFICACIÓN GLOBAL',
            title: 'SISTEMA DE RANKINGS',
            description: 'Sistema de ranking dinámico basado en MMR (Match Making Rating). Cada victoria te acerca a la cima, cada derrota te reta a mejorar.',
            image: './img/imgRanking.jpg',
            reverse: false,
            style: {},
            items: [
                'Sistema MMR transparente y justo',
                'Temporadas competitivas mensuales',
                'Recompensas por posición final',
                'Múltiples divisiones y rangos'
            ]
        },
        {
            id: 'tienda',
            sectionTitle: 'NUESTRA TIENDA',
            title: 'MERCHANDISING EXCLUSIVO',
            description: 'Descubre nuestra colección oficial de merchandising gaming. Camisetas, sudaderas, gorras y accesorios diseñados para verdaderos competidores.',
            image: 'merchandising-imagen.jpg',
            reverse: true,
            style: { background: 'var(--surface)' },
            items: [
                'Productos oficiales de calidad',
                'Diseños exclusivos limitados',
                'Envío rápido en 24-48h',
                'Descuentos para miembros VIP'
            ]
        }
    ];

    return (
        <>
            {features.map((feature, index) => (
                <FeatureSection key={index} {...feature} />
            ))}
        </>
    );
}

function FeatureSection({ id, title, description, image, reverse, items, style }) {
    return (
        <section id={id} style={style}>
            <div className="container">
                <div className={`info-card ${reverse ? 'reverse' : ''}`}>
                    <div className="info-illustration">
                        <img src={image} alt={title} className="illustration-image" />
                    </div>
                    <div className="info-content">
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <ul className="feature-list">
                            {items.map((item, idx) => (
                                <li key={idx}><span className="check">✓</span> {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}


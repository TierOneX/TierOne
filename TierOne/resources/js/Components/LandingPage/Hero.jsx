
import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-logo">
                    <img src="./img/favicon.png" alt="TIERONE Logo" className="logo-square" />
                    <div className="logo-text">
                        <span className="brand">TIERONE</span>
                        <span className="tagline">ARENA DE JUEGO</span>
                    </div>
                </div>
                <div className="badge">
                    <span>TORNEO DESTACADO</span>
                </div>
                <h1>
                    DOMINA LA<br />
                    <span className="highlight">COMPETICIÓN</span>
                </h1>
                <p>Únete al torneo de League of Legends más prestigioso de la temporada.</p>

                <div className="prize-info">
                    <button className="cta-button">
                        ÚNETE AHORA
                        <span>→</span>
                    </button>
                    <div className="prize-amount">
                        <div className="prize-label">Bote de premios:</div>
                        <div className="prize-value">hasta 5.000€</div>
                    </div>
                </div>
            </div>
        </section>
    );
}


import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg-overlay"></div>
            <div className="hero-content">

                <h1>
                    DOMINA LA<br />
                    <span className="highlight">COMPETICIÓN</span>
                </h1>

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


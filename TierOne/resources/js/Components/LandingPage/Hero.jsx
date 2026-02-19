import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="hero">
            <video
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                src="/images/landing/videos/hero-bg.mp4"
            />
            <div className="hero-bg-overlay"></div>
            <div className="hero-content">

                <h1>
                    DOMINA LA<br />
                    <span className="highlight">COMPETICIÓN</span>
                </h1>

                <div className="hero-auth-buttons">
                    <Link href="/login" className="hero-btn hero-btn-login">
                        INICIAR SESIÓN
                    </Link>
                    <Link href="/register" className="hero-btn hero-btn-register">
                        REGISTRARSE
                    </Link>
                </div>

                <div className="prize-info">
                    <div className="prize-amount">
                        <div className="prize-label">Bote de premios:</div>
                        <div className="prize-value">hasta 5.000€</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

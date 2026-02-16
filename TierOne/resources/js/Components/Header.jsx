import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Header({ cartCount = 0 }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Detectar scroll para efecto de sombra
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar menú móvil al redimensionar a desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { name: 'INICIO', href: '/home' },
        { name: 'PARTIDAS', href: '/matches' },
        { name: 'TORNEOS', href: '/tournaments' },
        { name: 'TIENDA', href: '/shop' },
        { name: 'COMUNIDAD', href: '/community' },
    ];

    const mobileBottomNav = [
        {
            name: 'INICIO',
            href: '/',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
                </svg>
            ),
        },
        {
            name: 'PARTIDAS',
            href: '/matches',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 3h2v2H6V3zm4 0h4v2h-4V3zm6 0h2v2h-2V3zM4 7h16v2H4V7zm2 4h2l1 8H5l1-8zm10 0h2l1 8h-4l1-8zm-5 0h2l1 8h-4l1-8z" />
                </svg>
            ),
        },
        {
            name: 'TIENDA',
            href: '/shop',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
                </svg>
            ),
        },
        {
            name: 'CUENTA',
            href: '/login',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* ========== HEADER PRINCIPAL ========== */}
            <header
                id="main-header"
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#111111] ${scrolled
                    ? 'shadow-lg shadow-black/50'
                    : ''
                    }`}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* === LOGO === */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <img
                                src="/images/Logo.png"
                                alt="TierOne"
                                className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="logo-text text-xl !flex-row">
                                <span className="word">TIER</span>
                                <span className="word">ONE</span>
                            </span>
                        </Link>

                        {/* === NAV DESKTOP (hidden en móvil) === */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-4 py-2 text-[13px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-colors duration-200 group"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#e31837] group-hover:w-3/4 transition-all duration-300" />
                                </Link>
                            ))}
                        </nav>

                        {/* === ACCIONES DERECHA === */}
                        <div className="flex items-center gap-3">
                            {/* Carrito */}
                            <button
                                id="cart-button"
                                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
                                aria-label="Carrito de compras"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-[#e31837] text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Botón Login - solo desktop */}
                            <Link
                                href="/login"
                                id="login-button"
                                className="hidden lg:inline-flex items-center px-6 py-2 bg-[#e31837] hover:bg-[#c2102d] text-white text-xs font-black uppercase tracking-widest rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-red-900/30 active:scale-95"
                            >
                                ACCEDER
                            </Link>

                            {/* Hamburguesa - solo móvil */}
                            <button
                                id="mobile-menu-toggle"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                                aria-label="Abrir menú"
                            >
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* === MENÚ MÓVIL DESPLEGABLE (hamburguesa) === */}
                <div
                    id="mobile-menu-dropdown"
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    style={{
                        background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)',
                        borderTop: isMobileMenuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                >
                    <div className="px-4 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-white/5">
                            <Link
                                href="/login"
                                className="block w-full text-center px-4 py-3 bg-[#e31837] hover:bg-[#c2102d] text-white text-sm font-black uppercase tracking-widest rounded-lg transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ACCEDER
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* ========== BARRA INFERIOR MÓVIL (fija abajo) ========== */}
            <nav
                id="mobile-bottom-nav"
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
                style={{
                    background: 'linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div className="flex items-center justify-around h-16 px-2">
                    {mobileBottomNav.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-white/70 hover:text-[#e31837] transition-colors duration-200 group"
                        >
                            <span className="group-hover:scale-110 transition-transform duration-200">
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}

import { Link } from '@inertiajs/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const servicesLinks = [
        { name: 'INICIO', href: '/' },
        { name: 'PARTIDAS', href: '/matches' },
        { name: 'TORNEOS', href: '/tournaments' },
        { name: 'TIENDA', href: '/shop' },
        { name: 'COMUNIDAD', href: '/community' },
    ];

    const supportLinks = [
        { name: 'Centro de Ayuda / FAQ', href: '/help' },
        { name: 'Contáctanos', href: '/contact' },
        { name: 'Envíos y Devoluciones', href: '/shipping' },
        { name: 'Términos de Servicio', href: '/terms' },
        { name: 'Política de Privacidad', href: '/privacy' },
    ];

    const socialLinks = [
        {
            name: 'Discord',
            href: '#',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
                </svg>
            ),
        },
        {
            name: 'Twitter',
            href: '#',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            href: '#',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            name: 'YouTube',
            href: '#',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
    ];

    // Iconos de métodos de pago
    const PaymentIcons = () => (
        <div className="flex items-center gap-3">
            {/* Visa */}
            <div className="w-10 h-6 rounded bg-white/10 flex items-center justify-center" title="Visa">
                <svg className="w-7 h-4 text-gray-400" viewBox="0 0 48 16" fill="currentColor">
                    <path d="M19.4 0.5L12.7 15.5H8.5L5.2 3.5C5 2.7 4.8 2.4 4.1 2C3.1 1.5 1.4 1 0 0.7L0.1 0.5H6.8C7.7 0.5 8.5 1.1 8.7 2.1L10.3 10.5L14.4 0.5H19.4ZM34.3 10.5C34.3 6.5 28.7 6.3 28.7 4.5C28.7 3.9 29.3 3.3 30.5 3.1C31.1 3 32.7 2.9 34.5 3.8L35.3 0.9C34.3 0.5 33 0.2 31.4 0.2C27.2 0.2 24.3 2.4 24.3 5.5C24.3 7.8 26.3 9 27.8 9.7C29.3 10.5 29.8 11 29.8 11.7C29.8 12.7 28.6 13.2 27.5 13.2C25.5 13.2 24.3 12.7 23.4 12.2L22.5 15.2C23.5 15.7 25.3 16 27.1 16C31.6 16 34.3 13.8 34.3 10.5ZM44.8 15.5H48L45.2 0.5H41.8C41 0.5 40.4 1 40.1 1.7L33.8 15.5H38.1L38.9 13.2H44.2L44.8 15.5ZM40.1 10L42.3 3.8L43.5 10H40.1ZM24.2 0.5L20.9 15.5H16.9L20.2 0.5H24.2Z" />
                </svg>
            </div>
            {/* Mastercard */}
            <div className="w-10 h-6 rounded bg-white/10 flex items-center justify-center" title="Mastercard">
                <svg className="w-6 h-4" viewBox="0 0 24 16">
                    <circle cx="8" cy="8" r="7" fill="#eb001b" opacity="0.7" />
                    <circle cx="16" cy="8" r="7" fill="#f79e1b" opacity="0.7" />
                    <path d="M12 2.4A7 7 0 0 0 9.6 8 7 7 0 0 0 12 13.6 7 7 0 0 0 14.4 8 7 7 0 0 0 12 2.4Z" fill="#ff5f00" opacity="0.8" />
                </svg>
            </div>
            {/* PayPal */}
            <div className="w-10 h-6 rounded bg-white/10 flex items-center justify-center" title="PayPal">
                <span className="text-[9px] font-black text-gray-400 tracking-tight">PAY</span>
            </div>
        </div>
    );

    return (
        <>
            {/* ==================== FOOTER DESKTOP ==================== */}
            <footer id="main-footer" className="bg-[#0d0d0f] border-t border-white/5">
                {/* Línea roja decorativa superior (visible en móvil como el mockup) */}
                <div className="lg:hidden w-full h-[3px] bg-gradient-to-r from-[#e31837] via-[#e31837] to-[#e31837]" />

                {/* === CONTENIDO PRINCIPAL === */}
                <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

                    {/* ---- DESKTOP: Layout de 4 columnas ---- */}
                    <div className="hidden lg:grid lg:grid-cols-4 gap-12 py-16">
                        {/* Col 1: Logo + Descripción */}
                        <div className="space-y-5">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <img
                                    src="/images/Logo.png"
                                    alt="TierOne"
                                    className="h-9 w-auto object-contain"
                                />
                                <span className="logo-text text-xl !flex-row">
                                    <span className="word">TIER</span>
                                    <span className="word">ONE</span>
                                </span>
                            </Link>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
                                ¿Quieres competir mientras juegas a tus juegos favoritos, e incluso comprar merchandising de ellos? Tierone es tu plataforma de confianza donde encontrarás todo lo que buscas.
                            </p>
                        </div>

                        {/* Col 2: Services */}
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white mb-6">
                                <span className="w-5 h-[2px] bg-[#e31837] rounded-full" />
                                PÁGINAS
                            </h3>
                            <ul className="space-y-3.5">
                                {servicesLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-500 text-sm hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3: Support */}
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white mb-6">
                                <span className="w-5 h-[2px] bg-[#e31837] rounded-full" />
                                SOPORTE
                            </h3>
                            <ul className="space-y-3.5">
                                {supportLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-500 text-sm hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 4: Connect */}
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white mb-6">
                                <span className="w-5 h-[2px] bg-[#e31837] rounded-full" />
                                CONECTA
                            </h3>
                            <div className="flex gap-3 mb-5">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
                                        aria-label={social.name}
                                        title={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">
                                Únete a la élite global
                            </p>
                        </div>
                    </div>

                    {/* ---- MÓVIL: Layout centrado vertical ---- */}
                    <div className="lg:hidden py-12 space-y-10">
                        {/* Logo + Tagline */}
                        <div className="text-center space-y-3">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <img
                                    src="/images/Logo.png"
                                    alt="TierOne"
                                    className="h-12 w-auto object-contain"
                                />
                                <span className="logo-text text-2xl !flex-row">
                                    <span className="word">TIER</span>
                                    <span className="word">ONE</span>
                                </span>
                            </Link>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
                                Elite Gaming & Streetwear
                            </p>
                        </div>

                        {/* Nav principal en móvil */}
                        <nav className="flex flex-col items-center gap-5">
                            {[
                                { name: 'HOME', href: '/' },
                                { name: 'PARTIDAS', href: '/matches' },
                                { name: 'TORNEOS', href: '/tournaments', highlight: true },
                                { name: 'TIENDA', href: '/shop' },
                                { name: 'COMUNIDAD', href: '/community' },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-xl font-black uppercase tracking-wider transition-colors duration-200 ${item.highlight
                                        ? 'text-[#e31837]'
                                        : 'text-white hover:text-[#e31837]'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Redes sociales */}
                        <div className="flex justify-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        {/* Legal & Support */}
                        <div className="text-center space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
                                Legal y Soporte
                            </p>
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                                <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
                                    Términos
                                </Link>
                                <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
                                    Privacidad
                                </Link>
                                <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">
                                    Contacto
                                </Link>
                            </div>
                        </div>

                        {/* Separador */}
                        <div className="w-3/4 mx-auto h-px bg-white/5" />

                        {/* Métodos de pago */}
                        <div className="flex justify-center">
                            <PaymentIcons />
                        </div>

                        {/* Secure checkout */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Pago Seguro Garantizado
                                </span>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-center space-y-1">
                            <p className="text-[11px] text-gray-600 uppercase tracking-wider">
                                © {currentYear} TierOne Entertainment. Todos los derechos reservados.
                            </p>
                            <p className="text-[10px] text-gray-700 uppercase tracking-widest">
                                Diseñado para la Ventaja Competitiva
                            </p>
                        </div>
                    </div>
                </div>

                {/* === BARRA INFERIOR DESKTOP === */}
                <div className="hidden lg:block border-t border-white/5">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
                        {/* Copyright */}
                        <p className="text-[11px] text-gray-600 font-medium uppercase tracking-wider">
                            © {currentYear} TierOne Gaming. Todos los derechos reservados. Diseñado para la élite.
                        </p>

                        {/* Métodos de pago */}
                        <div className="flex items-center gap-6">
                            <PaymentIcons />

                            {/* Verified Secure */}
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Pago Seguro</span>
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Espacio extra en móvil para que no tape la barra inferior */}
                <div className="lg:hidden h-20" />
            </footer>
        </>
    );
}

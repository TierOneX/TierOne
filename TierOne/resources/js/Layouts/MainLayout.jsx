import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function MainLayout({ children, cartCount = 0 }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white">
            <Header cartCount={cartCount} />

            {/* Contenido principal con padding para el header fijo */}
            <main className="pt-16 lg:pb-0 pb-16">
                {children}
            </main>

            <Footer />
        </div>
    );
}

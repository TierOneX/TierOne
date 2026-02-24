export default function ShopHero() {
    return (
        <section className="bg-gradient-to-b from-black via-gray-900 to-[#0a0a0a] pt-12 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 relative">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent italic tracking-tighter">
                        Tienda
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl font-medium">
                        Merchandising de la mejor calidad que encontrarás. <br />
                        <span className="text-red-500">Atento al siguiente drop.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

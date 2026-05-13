import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

/**
 * Botón de "Añadir al carrito".
 * Desktop: botón blanco con texto negro.
 * Mobile: botón rojo con texto blanco.
 */
export default function AddToCartBar({ producto, selectedVariant, variantes }) {
    const { addToCart } = useCart();
    const hasVariants = variantes && variantes.length > 0;
    const needsVariant = hasVariants && !selectedVariant;

    const handleAddToCart = () => {
        addToCart(producto, selectedVariant);
        // Opcional: mostrar un feedback más elegante que un alert
        // alert(`Añadido: ${producto.nombre}${selectedVariant ? ` — ${selectedVariant.nombre}` : ''}`);
    };

    return (
        <div className="mb-8">
            {/* Desktop */}
            <button
                id="add-to-cart-btn-desktop"
                onClick={handleAddToCart}
                disabled={needsVariant}
                className={`hidden md:flex w-full py-4 rounded-lg font-black text-sm uppercase tracking-widest items-center justify-center gap-3 transition-all ${needsVariant
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200 active:scale-[0.98]'
                    }`}
            >
                AÑADIR AL CARRITO
                <ArrowRight className="w-5 h-5" />
            </button>

            {/* Mobile */}
            <button
                id="add-to-cart-btn-mobile"
                onClick={handleAddToCart}
                disabled={needsVariant}
                className={`md:hidden flex w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest items-center justify-center gap-2 transition-all ${needsVariant
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-[#e31837] text-white active:scale-[0.98]'
                    }`}
            >
                <ShoppingCart className="w-5 h-5" />
                AÑADIR AL CARRITO
            </button>
        </div>
    );
}

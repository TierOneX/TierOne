import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};

/**
 * Cart Provider unificado.
 * Soporta 4 tipos de items: 'product', 'tournament', 'hydra', 'partida'
 * 
 * Cada item en el carrito tiene:
 *  - itemType: 'product' | 'tournament' | 'hydra'
 *  - cartId: identificador único para el item en el carrito
 *  - nombre, precio_venta, quantity
 *  - (opcional) variant, customization, customizationSurcharge
 *  - (opcional) torneo_id, pack_id, imagen_url
 */
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Cargar carrito desde localStorage al iniciar
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('tierone_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    useEffect(() => {
        // Guardar carrito en localStorage cada vez que cambie
        localStorage.setItem('tierone_cart', JSON.stringify(cart));
    }, [cart]);

    /**
     * Añadir item al carrito.
     * @param {object} product - Datos del item (nombre, precio_venta, id, etc.)
     * @param {object|null} variant - Variante del producto
     * @param {number} quantity - Cantidad
     * @param {object|null} customization - Datos de personalización
     * @param {string} itemType - Tipo: 'product', 'tournament', 'hydra'
     */
    const addToCart = (product, variant = null, quantity = 1, customization = null, itemType = 'product') => {
        setCart(prevCart => {
            // Torneos y Hydra packs: verificar si ya existe uno igual en el carrito
            if (itemType === 'tournament') {
                const exists = prevCart.find(item => item.itemType === 'tournament' && item.torneo_id === product.torneo_id);
                if (exists) return prevCart; // No duplicar inscripciones
            }
            if (itemType === 'hydra') {
                // Hydra packs se pueden acumular pero no duplicar el mismo pack
                const exists = prevCart.find(item => item.itemType === 'hydra' && item.pack_id === product.pack_id);
                if (exists) return prevCart;
            }

            // Los productos personalizados o no-product siempre son items nuevos
            if (customization || itemType !== 'product') {
                return [...prevCart, {
                    ...product,
                    variant,
                    quantity,
                    customization,
                    itemType,
                    customizationSurcharge: customization?.precio_elementos?.total_recargo || 0,
                    cartId: Math.random().toString(36).substr(2, 9)
                }];
            }

            // Productos normales: buscar si ya existe para agrupar
            const existingItemIndex = prevCart.findIndex(item =>
                item.id === product.id &&
                item.itemType === 'product' &&
                JSON.stringify(item.variant) === JSON.stringify(variant) &&
                !item.customization
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            }

            return [...prevCart, { 
                ...product, 
                variant, 
                quantity,
                itemType: 'product',
                cartId: Math.random().toString(36).substr(2, 9) 
            }];
        });
    };

    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart => prevCart.map(item => {
            if (item.cartId === cartId) {
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    /**
     * Limpiar solo items de un tipo específico.
     */
    const clearCartByType = (itemType) => {
        setCart(prevCart => prevCart.filter(item => item.itemType !== itemType));
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const subtotal = cart.reduce((total, item) => {
        const basePrice = Number(item.precio_venta);
        const surcharge = Number(item.customizationSurcharge || 0);
        return total + ((basePrice + surcharge) * item.quantity);
    }, 0);

    /**
     * Obtener items agrupados por tipo.
     */
    const getItemsByType = (type) => cart.filter(item => item.itemType === type);

    /**
     * Calcular subtotal de un tipo específico.
     */
    const getSubtotalByType = (type) => {
        return cart
            .filter(item => item.itemType === type)
            .reduce((total, item) => {
                const basePrice = Number(item.precio_venta);
                const surcharge = Number(item.customizationSurcharge || 0);
                return total + ((basePrice + surcharge) * item.quantity);
            }, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            clearCartByType,
            cartCount,
            subtotal,
            getItemsByType,
            getSubtotalByType,
        }}>
            {children}
        </CartContext.Provider>
    );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};

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

    const addToCart = (product, variant = null, quantity = 1) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item =>
                item.id === product.id &&
                JSON.stringify(item.variant) === JSON.stringify(variant)
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            }

            return [...prevCart, { ...product, variant, quantity }];
        });
    };

    const removeFromCart = (productId, variant = null) => {
        setCart(prevCart => prevCart.filter(item =>
            !(item.id === productId && JSON.stringify(item.variant) === JSON.stringify(variant))
        ));
    };

    const updateQuantity = (productId, variant = null, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart => prevCart.map(item => {
            if (item.id === productId && JSON.stringify(item.variant) === JSON.stringify(variant)) {
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const subtotal = cart.reduce((total, item) => total + (Number(item.precio_venta) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

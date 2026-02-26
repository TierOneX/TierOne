import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Vista de carga mientras se inicializa Stripe.
 */
export default function CheckoutLoadingView() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                Preparando el pago seguro...
            </p>
        </div>
    );
}

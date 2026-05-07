import React from 'react';
import { AlertCircle, ShoppingCart, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop con desenfoque progresivo */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Contenido del Modal */}
            <div className="relative bg-[#111] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-red-600 to-purple-600" />

                <div className="p-8">
                    {/* Icono y Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-xl uppercase tracking-tight">
                                {title || '¿Confirmar Diseño?'}
                            </h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Paso Final de Personalización</p>
                        </div>
                    </div>

                    {/* Mensaje */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        {message || '¿Has terminado de personalizar tu producto? Una vez añadido al carrito no podrás realizar más cambios en este diseño.'}
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 bg-[#e31837] hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-600/20 active:scale-95"
                        >
                            <ShoppingCart size={18} />
                            ¡SÍ, AÑADIR AL CARRITO!
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-white/5"
                        >
                            SEGUIR EDITANDO
                        </button>
                    </div>
                </div>

                {/* Botón cerrar X */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}

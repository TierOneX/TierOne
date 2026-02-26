import { useState } from 'react';
import { Truck, Zap, RotateCcw, ChevronDown } from 'lucide-react';

/**
 * Secciones acordeón: Diseño, Especificaciones, Envío, etc.
 */
const DEFAULT_SECTIONS = [
    {
        key: 'design',
        title: 'DISEÑO Y RENDIMIENTO',
        content: null, // se rellena con la descripción del producto
    },
    {
        key: 'specs',
        title: 'ESPECIFICACIONES',
        content: null, // se rellenará dinámicamente
    },
    {
        key: 'shipping',
        title: 'ENVÍO Y DEVOLUCIONES',
        content: (
            <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#e31837] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold">Envío estándar gratuito</p>
                        <p>Entrega en 3-5 días laborables para pedidos superiores a 50€.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[#e31837] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold">Envío express</p>
                        <p>Entrega en 24-48h. Coste adicional de 4,99€.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 text-[#e31837] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold">Devoluciones</p>
                        <p>30 días para devolver. Producto sin usar y con etiquetas.</p>
                    </div>
                </div>
            </div>
        ),
    },
];

export default function ProductAccordion({ producto }) {
    const [openSection, setOpenSection] = useState(null);

    const toggle = (key) => {
        setOpenSection(openSection === key ? null : key);
    };

    // Construir contenido dinámico
    const sections = DEFAULT_SECTIONS.map((section) => {
        if (section.key === 'design' && producto.descripcion) {
            return {
                ...section,
                content: (
                    <p className="text-gray-400 text-sm leading-relaxed">{producto.descripcion}</p>
                ),
            };
        }
        if (section.key === 'specs') {
            return {
                ...section,
                content: (
                    <div className="space-y-2">
                        {producto.categoria && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Categoría</span>
                                <span className="text-gray-300">{producto.categoria.nombre}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Rating</span>
                            <span className="text-gray-300">{producto.rating_promedio} / 5.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Ventas</span>
                            <span className="text-gray-300">{producto.ventas_totales} unidades</span>
                        </div>
                        {producto.variantes && producto.variantes.length > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Variantes disponibles</span>
                                <span className="text-gray-300">
                                    {producto.variantes.filter((v) => v.disponible).length} de {producto.variantes.length}
                                </span>
                            </div>
                        )}
                    </div>
                ),
            };
        }
        return section;
    });

    return (
        <div className="border-t border-gray-800">
            {sections.map((section) => (
                <div key={section.key} className="border-b border-gray-800">
                    <button
                        id={`accordion-${section.key}`}
                        onClick={() => toggle(section.key)}
                        className="w-full flex items-center justify-between py-4 text-left group"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-red-500 transition-colors">
                            {section.title}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openSection === section.key ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === section.key ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
                            }`}
                    >
                        {section.content}
                    </div>
                </div>
            ))}
        </div>
    );
}

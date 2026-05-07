/**
 * Utilidades para manejo de imágenes en TierOne
 */

export const imgUrl = (src) => {
    if (!src) return null;
    
    // Si ya es una URL completa o base64, devolver tal cual
    if (typeof src !== 'string') return null;
    if (src.startsWith('http') || src.startsWith('data:')) return src;

    // Asegurar que empiece con /
    let path = src.startsWith('/') ? src : `/${src}`;
    
    // Limpiar barras duplicadas
    path = path.replace(/\/+/g, '/');

    // Si ya tiene prefijos conocidos, devolver (asegurando el / inicial)
    if (path.startsWith('/storage') || path.startsWith('/assets') || path.startsWith('/images')) {
        return path;
    }

    // Por defecto, todas las imágenes de productos subidas van a /storage/
    // Si la ruta es 'products/foo.jpg' -> '/storage/products/foo.jpg'
    // Si la ruta es '/products/foo.jpg' -> '/storage/products/foo.jpg'
    return '/storage' + path;
};

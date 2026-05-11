/**
 * Construye la URL de una imagen de IGDB a partir de su image_id.
 * @param {string} imageId - El image_id de IGDB (ej: "co1wyy")
 * @param {string} size - Tamaño: 't_thumb', 't_cover_big', 't_screenshot_huge', 't_1080p', etc.
 * @returns {string} URL completa de la imagen
 */
export function igdbImageUrl(imageId, size = 't_cover_big') {
    if (!imageId) return '/images/placeholder-game.png';
    return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}

/**
 * Tamaños predefinidos para uso rápido.
 */
export const IGDB_SIZES = {
    THUMB: 't_thumb',           // 90x128
    COVER: 't_cover_big',       // 264x374
    COVER_2X: 't_cover_big_2x', // 528x748
    SCREENSHOT: 't_screenshot_big',  // 889x500
    SCREENSHOT_HD: 't_screenshot_huge', // 1280x720
    FULL_HD: 't_1080p',         // 1920x1080
    ORIGINAL: 't_original',
};

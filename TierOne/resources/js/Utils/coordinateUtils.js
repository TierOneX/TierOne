/**
 * Sistema de Coordenadas para Personalización TierOne
 *
 * Coordenadas en BD: ABSOLUTAS (px) sobre la imagen original.
 * canvas_width / canvas_height = dimensiones naturales de la imagen.
 *
 * Para renderizar en pantalla se calcula un factor `scale`:
 *   scale = min(containerW / imgW, containerH / imgH, 1)
 */

/**
 * Calcula el factor de escala para ajustar una imagen en un contenedor
 * manteniendo aspect ratio.
 */
export function calculateScale(imgWidth, imgHeight, maxWidth, maxHeight) {
    if (!imgWidth || !imgHeight || !maxWidth || !maxHeight) return { scale: 1, displayWidth: 0, displayHeight: 0 };
    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
    return {
        scale,
        displayWidth: Math.round(imgWidth * scale),
        displayHeight: Math.round(imgHeight * scale),
    };
}

/**
 * Convierte coordenadas absolutas (BD) a coordenadas de pantalla.
 */
export function toScreenCoords(absCoords, scale) {
    return {
        x: absCoords.x * scale,
        y: absCoords.y * scale,
        width: absCoords.width * scale,
        height: absCoords.height * scale,
    };
}

/**
 * Convierte coordenadas de pantalla a absolutas (para guardar en BD).
 */
export function toAbsCoords(screenCoords, scale) {
    return {
        x: Math.round(screenCoords.x / scale),
        y: Math.round(screenCoords.y / scale),
        width: Math.round(screenCoords.width / scale),
        height: Math.round(screenCoords.height / scale),
    };
}

/**
 * Convierte coordenadas absolutas a porcentajes (para CSS overlays).
 */
export function toPercentCoords(absCoords, canvasWidth, canvasHeight) {
    return {
        left: `${(absCoords.x / canvasWidth) * 100}%`,
        top: `${(absCoords.y / canvasHeight) * 100}%`,
        width: `${(absCoords.width / canvasWidth) * 100}%`,
        height: `${(absCoords.height / canvasHeight) * 100}%`,
    };
}

# TODO — TierOne

## 🔴 CRÍTICO — Problema de carga lenta

**Síntoma:** Las páginas tardan varios segundos en cargar, no se percibe como una SPA fluida.

**Causa raíz identificada:**
- `php artisan serve` es single-thread → procesa una petición a la vez
- `npm run dev` (Vite) no hace bundle — sirve cada módulo JS por separado al vuelo
- Combinación = tiempos de primera carga altos y navegación perceptiblemente lenta

**Soluciones propuestas (por prioridad):**

1. **[INMEDIATO]** Migrar a Apache de XAMPP con VirtualHost
   - VirtualHost ya configurado en `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
   - Pendiente: añadir `127.0.0.1 tierone.local` al archivo `hosts` de Windows y reiniciar Apache
   - Resultado esperado: multi-hilo, mucho más rápido en desarrollo

2. **[MEDIO PLAZO]** Añadir índices en las columnas más consultadas de la BD
   - Tablas afectadas: `torneos`, `ordenes`, `inscripciones_torneo`, `productos`
   - Columnas candidatas: `id_usuario`, `id_torneo`, `estado`, `fecha_inicio`

3. **[PRODUCCIÓN]** Ejecutar `npm run build` + servir con nginx/Apache
   - El bundle minificado + caché del navegador reduce el tiempo de primera carga a < 500ms
   - Usar `php artisan optimize` y `php artisan config:cache` antes de desplegar

4. **[LARGO PLAZO]** Evaluar caché a nivel de controlador para datos que no cambian frecuentemente
   - Ej: lista de juegos, categorías, productos destacados → cacheable con `Cache::remember()`

---
_Anotado: 2026-02-24_

# Módulo 6 — Admin: Visualización de Pedidos Personalizados

> **PREREQUISITO**: Módulos 1, 2 y 5 completados
> **RESULTADO**: El admin puede ver los diseños personalizados de cada pedido y descargar PNG + JSON para enviar al productor.
> **CHECKPOINT**: En el detalle de un pedido con personalización, se ven las previews y se pueden descargar.

---

## 6.1 Modificar `Orders.jsx` del Admin

**Archivo**: `TierOne/TierOne/resources/js/Pages/PanelAdminEcommerce/Orders.jsx`

### Cambios requeridos:

En la vista de detalle de una orden (modal o sección expandida), cuando un `ItemOrden` tiene `personalizacion_data`:

**A) Mostrar badge y preview**:
```jsx
{item.personalizacion_data && (
    <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">
                PERSONALIZADO
            </span>
            <span className="text-[10px] text-purple-600 font-bold">
                {item.personalizacion_data.precio_elementos?.textos || 0} texto(s),
                {item.personalizacion_data.precio_elementos?.imagenes || 0} imagen(es)
                — +€{item.personalizacion_data.precio_elementos?.total_recargo?.toFixed(2)}
            </span>
        </div>

        {/* Preview del diseño */}
        {item.personalizacion_imagen && (
            <img
                src={item.personalizacion_imagen}
                alt="Diseño personalizado"
                className="w-32 h-32 rounded-lg border border-purple-200 object-contain mb-2"
            />
        )}

        {/* Botones de descarga */}
        <div className="flex gap-2 mt-2">
            <a
                href={item.personalizacion_imagen}
                download={`diseno_${item.id}.png`}
                className="px-3 py-1.5 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-purple-700 flex items-center gap-1.5"
            >
                <Download size={12} /> PNG
            </a>
            <button
                onClick={() => {
                    const json = JSON.stringify(item.personalizacion_data, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `diseno_${item.id}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-200 flex items-center gap-1.5 border border-gray-200"
            >
                <FileJson size={12} /> JSON
            </button>
        </div>
    </div>
)}
```

**Nota**: Importar `Download` y `FileJson` de lucide-react.

---

## 6.2 Modificar `OrderController.php` — Incluir datos de personalización

**Archivo**: `TierOne/TierOne/app/Http/Controllers/Web/OrderController.php`

Al cargar las órdenes para el admin, asegurar que los items incluyen `personalizacion_data` y `personalizacion_imagen`.

En el método `index` o donde se mapean los items de la orden, añadir:
```php
// Al mapear items de la orden en la respuesta Inertia:
'personalizacion_data'   => $item->personalizacion_data,
'personalizacion_imagen' => $item->personalizacion_imagen,
```

---

## 6.3 Endpoint de descarga del diseño

Añadir en `web.php`, dentro del grupo admin:
```php
Route::get('/orders/{orden}/items/{item}/design', [App\Http\Controllers\Web\OrderController::class, 'downloadDesign'])->name('orders.design');
```

Método en `OrderController.php`:
```php
/**
 * Descarga los archivos del diseño personalizado de un item.
 */
public function downloadDesign(Orden $orden, ItemOrden $item)
{
    if (!$item->personalizacion_data) {
        abort(404, 'Este item no tiene personalización');
    }

    // Si se pide el PNG
    if (request('format') === 'png' && $item->personalizacion_imagen) {
        $path = str_replace('/storage/', '', $item->personalizacion_imagen);
        return Storage::disk('public')->download($path, "diseno_orden_{$orden->id}_item_{$item->id}.png");
    }

    // Por defecto: descargar JSON
    return response()->json($item->personalizacion_data)
        ->header('Content-Disposition', "attachment; filename=diseno_orden_{$orden->id}_item_{$item->id}.json");
}
```

---

## Verificación del Módulo 6

1. Completar un pedido con un producto personalizado
2. Ir al panel admin → Órdenes → abrir el pedido
3. Verificar que aparece el badge "PERSONALIZADO" en el item
4. Verificar que se muestra la preview del diseño
5. Descargar PNG → se abre/descarga correctamente
6. Descargar JSON → contiene las posiciones, fuentes, colores de todos los elementos
7. El JSON es comprensible para un productor (contiene toda la info necesaria para reproducir el diseño)

---

## Estructura del JSON que recibe el productor

```json
{
    "producto_id": 42,
    "producto_nombre": "Camiseta Gaming Pro",
    "zonas": [
        {
            "zona_id": 1,
            "zona_nombre": "Frontal",
            "imagen_base": "/storage/customizations/bases/camiseta_front.png",
            "area_impresion": {
                "x": 100,
                "y": 80,
                "width": 300,
                "height": 350
            },
            "capas": [
                {
                    "tipo": "texto",
                    "contenido": "PLAYER ONE",
                    "x": 150,
                    "y": 200,
                    "width": 180,
                    "height": 40,
                    "fontSize": 32,
                    "fontFamily": "Impact",
                    "color": "#ff0000",
                    "rotation": 0
                },
                {
                    "tipo": "imagen",
                    "contenido": "/storage/customizations/uploads/abc123.png",
                    "x": 180,
                    "y": 280,
                    "width": 120,
                    "height": 120,
                    "rotation": 15
                }
            ]
        }
    ],
    "precio_elementos": {
        "textos": 1,
        "imagenes": 1,
        "precio_texto": 2.00,
        "precio_imagen": 3.00,
        "total_recargo": 5.00
    }
}
```

El productor recibe:
1. **PNG**: Imagen visual del diseño final (lo que verá el cliente)
2. **JSON**: Datos técnicos con posiciones exactas en píxeles, fuentes, colores, y rutas a las imágenes originales subidas por el usuario en alta resolución

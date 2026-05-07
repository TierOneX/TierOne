# Módulo 5 — Integración Carrito y Checkout

> **PREREQUISITO**: Módulos 1, 2 y 4 completados
> **RESULTADO**: Los productos personalizados se añaden al carrito con sus datos de diseño y recargo, y persisten hasta el checkout.
> **CHECKPOINT**: Un producto personalizado aparece en el carrito con precio desglosado.

---

## 5.1 Modificar `CartContext.jsx`

**Archivo**: `TierOne/TierOne/resources/js/Contexts/CartContext.jsx`

### Cambios:

**A) Modificar firma de `addToCart`** para aceptar datos de personalización:

```jsx
// ANTES:
const addToCart = (product, variant = null, quantity = 1) => {

// DESPUÉS:
const addToCart = (product, variant = null, quantity = 1, customization = null) => {
```

**B) Modificar la lógica de deduplicación**: un producto personalizado NUNCA se agrupa con otro (cada diseño es único):

```jsx
const addToCart = (product, variant = null, quantity = 1, customization = null) => {
    setCart(prevCart => {
        // Los productos personalizados siempre son items nuevos (cada diseño es único)
        if (customization) {
            return [...prevCart, {
                ...product,
                variant,
                quantity,
                customization,
                customizationSurcharge: customization.precio_elementos?.total_recargo || 0,
            }];
        }

        // Productos normales: buscar duplicado
        const existingItemIndex = prevCart.findIndex(item =>
            item.id === product.id &&
            JSON.stringify(item.variant) === JSON.stringify(variant) &&
            !item.customization
        );

        if (existingItemIndex > -1) {
            const newCart = [...prevCart];
            newCart[existingItemIndex].quantity += quantity;
            return newCart;
        }

        return [...prevCart, { ...product, variant, quantity }];
    });
};
```

**C) Modificar cálculo de subtotal** para incluir recargo:

```jsx
// ANTES:
const subtotal = cart.reduce((total, item) =>
    total + (Number(item.precio_venta) * item.quantity), 0);

// DESPUÉS:
const subtotal = cart.reduce((total, item) => {
    const basePrice = Number(item.precio_venta);
    const surcharge = Number(item.customizationSurcharge || 0);
    return total + ((basePrice + surcharge) * item.quantity);
}, 0);
```

---

## 5.2 Modificar `CarritoController.php` (Backend)

**Archivo**: `TierOne/TierOne/app/Http/Controllers/CarritoController.php`

### Cambios en el método `store`:

**A) Añadir validación** de `personalizacion_data`:
```php
// En StoreCarritoRequest o directamente en el método, añadir:
'personalizacion_data' => 'nullable|array',
```

**B) Incluir datos de personalización** al crear el ItemCarrito:
```php
ItemCarrito::create([
    'id_carrito'           => $carrito->id,
    'id_producto'          => $validated['id_producto'],
    'id_variante'          => $validated['id_variante'],
    'cantidad'             => $validated['cantidad'],
    'precio_unitario'      => $precio,
    'subtotal'             => $precio * $validated['cantidad'],
    'fecha_agregado'       => now(),
    'personalizacion_data' => $validated['personalizacion_data'] ?? null,  // NUEVO
]);
```

**C) Al calcular subtotal**, sumar el recargo de personalización:
```php
private function recalcularTotal(Carrito $carrito)
{
    $total = 0;
    foreach ($carrito->items as $item) {
        $recargo = 0;
        if ($item->personalizacion_data) {
            $data = is_array($item->personalizacion_data)
                ? $item->personalizacion_data
                : json_decode($item->personalizacion_data, true);
            $recargo = $data['precio_elementos']['total_recargo'] ?? 0;
        }
        $total += ($item->precio_unitario + $recargo) * $item->cantidad;
    }
    $carrito->subtotal = $total;
    $carrito->save();
}
```

---

## 5.3 Modificar `Cart.jsx` — Mostrar personalización

**Archivo**: `TierOne/TierOne/resources/js/Pages/Cart.jsx`

En la lista de items del carrito, si un item tiene `customization`, mostrar:

1. **Badge "PERSONALIZADO"** junto al nombre del producto:
```jsx
{item.customization && (
    <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded border border-purple-200 uppercase font-black ml-2">
        Personalizado
    </span>
)}
```

2. **Preview del diseño** (miniatura del PNG renderizado con el producto completo):
```jsx
{item.customization?.render_principal && (
    <div className="mt-2">
        <img 
            src={item.customization.render_principal} 
            alt="Tu diseño" 
            className="w-24 h-24 rounded-xl border border-white/10 object-contain bg-[#111] shadow-lg" 
        />
    </div>
)}
```

3. **Precio desglosado**:
```jsx
{item.customizationSurcharge > 0 && (
    <p className="text-[10px] text-purple-500 mt-1">
        +€{Number(item.customizationSurcharge).toFixed(2)} personalización
        ({item.customization.precio_elementos.textos} texto(s), {item.customization.precio_elementos.imagenes} imagen(es))
    </p>
)}
```

4. **Desactivar botón de incrementar cantidad** en productos personalizados (cada personalización es única, no se puede duplicar automáticamente):
```jsx
// En el control de cantidad, si item.customization existe, solo permitir cantidad 1
// o bien permitir cambiarla pero con un aviso
```

---

## 5.4 Modificar flujo de Checkout/Stripe

**Archivo**: `TierOne/TierOne/app/Http/Controllers/StripeController.php`

Al crear la orden desde el checkout, asegurar que `personalizacion_data` se copia de `ItemCarrito` a `ItemOrden`.

En el flujo donde se crean los `ItemOrden` a partir del carrito:
```php
// Al crear ItemOrden, incluir:
'personalizacion_data'   => $itemCarrito->personalizacion_data,
'personalizacion_imagen' => null, // Se generará cuando el admin procese el pedido
```

Si el diseño incluye renders en base64, guardar el PNG via `CustomizationService::saveRenderedDesign()` y almacenar la ruta en `personalizacion_imagen`.

---

## Verificación del Módulo 5

1. Personalizar un producto en el editor → clic "Añadir al carrito"
2. Ir al carrito → verificar que aparece con badge "PERSONALIZADO"
3. Verificar que el precio muestra base + recargo
4. Verificar que el subtotal total es correcto
5. Recargar la página → los datos persisten (localStorage)
6. Completar un checkout → verificar que la orden se crea con `personalizacion_data`

# Módulo 0 — Contexto del Proyecto TierOne

> **OBJETIVO**: Proporcionar a cualquier agente/modelo todo el contexto necesario para implementar los demás módulos sin necesidad de explorar el repositorio.

---

## 1. Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Laravel (PHP) | Latest |
| Base de datos | SQLite | — |
| Frontend | React | 18.x |
| Routing/SSR | Inertia.js | v2 |
| Estilos | TailwindCSS | 3.x |
| Bundler | Vite | 7.x |
| Pagos | Stripe | — |
| Iconos | Lucide React | 0.575+ |
| Componentes UI | Headless UI | 2.x |

---

## 2. Estructura de Directorios (relevante)

```
TierOne/TierOne/                          ← Raíz del proyecto Laravel
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Web/                      ← Controladores Inertia (SSR)
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   └── OrderController.php
│   │   │   ├── Api/                      ← Controladores API JSON
│   │   │   ├── CarritoController.php     ← Carrito (API JSON)
│   │   │   └── StripeController.php
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   │   ├── Producto.php
│   │   ├── Categoria.php
│   │   ├── VarianteProducto.php
│   │   ├── ImagenProducto.php
│   │   ├── Carrito.php
│   │   ├── ItemCarrito.php
│   │   ├── ItemOrden.php
│   │   ├── Orden.php
│   │   └── ...
│   ├── Services/
│   │   ├── ProductService.php
│   │   ├── OrderService.php
│   │   ├── CategoryService.php
│   │   └── InvoiceService.php
│   └── Traits/
├── database/
│   ├── migrations/
│   └── database.sqlite
├── resources/
│   └── js/
│       ├── app.jsx
│       ├── Pages/
│       │   ├── Product.jsx               ← Página de detalle de producto
│       │   ├── Shop.jsx                  ← Tienda/catálogo
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   └── PanelAdminEcommerce/
│       │       ├── Products.jsx          ← Admin: gestión de productos
│       │       ├── Orders.jsx            ← Admin: gestión de pedidos
│       │       ├── Categories.jsx
│       │       └── Dashboard.jsx
│       ├── Components/
│       │   ├── Product/
│       │   │   ├── ProductGallery.jsx
│       │   │   ├── ProductInfo.jsx
│       │   │   ├── VariantSelector.jsx
│       │   │   ├── AddToCartBar.jsx
│       │   │   ├── ProductAccordion.jsx
│       │   │   └── RelatedProducts.jsx
│       │   ├── PanelAdminEcommerce/
│       │   │   ├── PanelLayout.jsx       ← Layout del admin panel
│       │   │   ├── AdminTable.jsx        ← Tabla reutilizable
│       │   │   ├── AdminModal.jsx        ← Modal reutilizable
│       │   │   └── FilterBar.jsx         ← Barra de filtros
│       │   └── ...
│       ├── Contexts/
│       │   └── CartContext.jsx           ← Estado global del carrito (localStorage)
│       └── Layouts/
│           └── MainLayout.jsx
├── routes/
│   ├── web.php                           ← Rutas web (Inertia)
│   └── api.php                           ← Rutas API
├── public/
├── storage/
│   └── app/public/                       ← Archivos públicos (imágenes subidas)
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 3. Convenciones del Proyecto

### Nombres en español
- Tablas: `productos`, `categorias`, `items_carrito`, `ordenes`
- Campos: `id_producto`, `precio_venta`, `fecha_creacion`
- Modelos: `Producto`, `Categoria`, `ItemCarrito`

### Patrón arquitectónico
- **Controladores Web** (`app/Http/Controllers/Web/`) → renderizan vistas Inertia
- **Controladores API** (`app/Http/Controllers/Api/`) → responden JSON
- **Services** (`app/Services/`) → lógica de negocio reutilizable
- Controladores delegan lógica a Services

### Frontend
- **Inertia.js** para navegación SPA sin API explícita
- **useForm** de Inertia para formularios con validación server-side
- **router.get/post** de Inertia para navegación programática
- **CartContext** usa localStorage (carrito client-side)
- **TailwindCSS** con estilo gaming: fondo oscuro `#0a0a0a`, acento rojo `#e31837`, tipografía `font-black uppercase tracking-widest`

### Admin Panel
- Usa `PanelLayout` como wrapper
- Tablas con `AdminTable` + `FilterBar`
- Modales con `AdminModal`
- Botones estilo: `bg-red-600 text-white font-black uppercase text-[10px] tracking-widest`

---

## 4. Modelo de Datos Actual (relevante)

### Tabla `productos`
```sql
id, id_categoria (FK), id_proveedor (FK), nombre, slug, descripcion,
precio_proveedor (decimal 10,2), precio_venta (decimal 10,2),
imagen_principal (string nullable), destacado (bool), activo (bool),
fecha_creacion (timestamp), ventas_totales (int), rating_promedio (decimal 3,2),
created_at, updated_at
```

### Tabla `imagenes_producto`
```sql
id, id_producto (FK), url (string), orden (int), es_principal (bool), timestamps
```

### Tabla `variantes_productos`
```sql
id, id_producto (FK), nombre, sku (nullable), precio (decimal 10,2),
disponible (bool), ultima_verificacion_stock (datetime nullable), timestamps
```

### Tabla `items_carrito`
```sql
id, id_carrito (FK), id_producto, id_variante (nullable),
cantidad, precio_unitario (decimal), subtotal (decimal), fecha_agregado
```

### Tabla `items_orden`
```sql
id, id_orden (FK), id_producto (FK), id_variante (FK nullable),
id_proveedor (FK), cantidad, precio_unitario (decimal), subtotal (decimal),
timestamps
```

---

## 5. Código Existente Clave

### CartContext.jsx — Carrito en localStorage
```jsx
// Función addToCart actual (se modificará en Módulo 5)
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

// Subtotal actual (se modificará en Módulo 5)
const subtotal = cart.reduce((total, item) =>
    total + (Number(item.precio_venta) * item.quantity), 0);
```

### CarritoController.php — Método store (se modificará en Módulo 5)
```php
// Al crear un ItemCarrito, se debe añadir personalizacion_data
ItemCarrito::create([
    'id_carrito'      => $carrito->id,
    'id_producto'     => $validated['id_producto'],
    'id_variante'     => $validated['id_variante'],
    'cantidad'        => $validated['cantidad'],
    'precio_unitario' => $precio,
    'subtotal'        => $precio * $validated['cantidad'],
    'fecha_agregado'  => now()
]);
```

### Product.jsx — Página de detalle (se modificará en Módulo 4)
- Usa componentes: `ProductGallery`, `ProductInfo`, `VariantSelector`, `AddToCartBar`
- Se añadirá un botón "PERSONALIZAR" condicional

### Products.jsx (Admin) — Formulario de producto (se modificará en Módulo 3)
- Usa `useForm` de Inertia con campos: nombre, categoría, proveedor, precios, imagen, activo, destacado
- Se añadirá checkbox "personalizable" + enlace a configurar zonas

---

## 6. Rutas Web Existentes (web.php)

```php
// Shop
Route::get('/shop', ...)->name('shop');
Route::get('/shop/{slug}', ...)->name('product.show');

// Admin Panel
Route::prefix('panel-admin-ecommerce')->name('panel.ecommerce.')->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{producto}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{producto}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
    // ... más rutas admin
});

// Carrito (API)
// En api.php: /api/carrito con CarritoController (store, update, destroy)
```

---

## 7. Dependencia Nueva Requerida

```bash
npm install fabric
```

La librería `fabric` (Fabric.js) se usará para el canvas del editor de personalización. Versión recomendada: latest (6.x).

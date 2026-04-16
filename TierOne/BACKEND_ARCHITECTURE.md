# TierOne - Backend Architecture & Guidelines

Este documento describe la arquitectura y los patrones de diseño utilizados en el backend de la plataforma TierOne, construida sobre Laravel. El objetivo es mantener una base de código limpia, escalable y mantenible.

## 1. Patrón Arquitectónico: Arquitectura por Capas (Layered Architecture)

El proyecto utiliza un enfoque de **Arquitectura por Capas**, inspirado en la separación de responsabilidades de la *Arquitectura Hexagonal*.

La regla de oro es: **Los Controladores no deben contener lógica de negocio**. Toda lógica de negocio, validaciones complejas y comunicación estructural con los modelos debe residir en la capa de **Servicios**.

### Flujo de Vida de una Petición
1. **Rutas (`routes/web.php` o `routes/api.php`)** -> Reciben la petición HTTP.
2. **Capa de Transporte (Controladores)** -> Valida el Request, llama al Servicio y devuelve la Vista o el JSON.
3. **Capa de Negocio (Servicios)** -> Ejecuta reglas, procesos y llama a la capa de datos.
4. **Capa de Datos (Modelos de Eloquent)** -> Interactúa con la base de datos MySQL/PostgreSQL.

---

## 2. Estructura de Directorios Clave

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/          # Controladores que devuelven JSON (Consumibles por Apps y Terceros)
│   │   └── Web/          # Controladores que devuelven componentes de Inertia.js (React/Vue)
│   ├── Requests/         # FormRequests para validación estricta de datos de entrada.
│   └── Middleware/       # Filtros HTTP (ej. roles, permisos, Sanctum).
│
├── Models/               # Representación pura de tablas de Base de Datos y relaciones.
│
├── Services/             # ✨ El núcleo de la aplicación. Contiene la lógica de negocio.
│
└── Traits/
    └── ApiResponseTrait.php # Utilidad para estandarizar las respuestas JSON de la API.
```

---

## 3. Capa de Transporte: Web vs API

Dado que TierOne sirve simultáneamente una interfaz web moderna y una API consumible, se han separado los controladores según el contexto de la respuesta. 

### `App\Http\Controllers\Web`
- **Responsabilidad:** Atender las peticiones de los navegadores.
- **Respuesta:** Devuelve vistas renderizadas mediante `Inertia::render()`.
- **Manejo de Errores:** Laravel maneja las redirecciones de vuelta (`redirect()->back()`) con sesiones y errores en cookies.
- **Ejemplo:** `Web\ProductController@index` (renderiza el catálogo en frontend).

### `App\Http\Controllers\Api`
- **Responsabilidad:** Atender integraciones, integraciones móviles o Single Page Applications puras.
- **Respuesta:** Devuelve `JsonResponse`. Hace un uso intensivo del `ApiResponseTrait` (`$this->successResponse()`).
- **Manejo de Errores:** No hay sesiones. Devuelve respuestas de formato estándar en JSON (e.g. 404, 422, 500).
- **Convención:** Los nombres de los controladores comparten estandarización en Inglés (ej. `ProductController`), lo cual ayuda al lenguaje ubicuo independientemente del frontend.

---

## 4. Capa de Negocio: Los Servicios (Services)

Cada entidad central del dominio (Categoría, Producto, Orden) cuenta con un servicio dedicado que centraliza sus operaciones:

- **`CategoryService`:** Maneja la obtención de árboles de categorías, creación estandarizada con Slugs, etc.
- **`ProductService`:** Maneja filtrados complejos dinámicos de catálogo. Las cargas de imágenes vinculadas al disco `public` o `S3` se procesan aquí (no en el controlador).
- **`OrderService`:** Abstrae transacciones de base de datos (`DB::transaction`). Si un pedido consta de Orden, Items y Dirección de envío, el servicio se asegura de crearlas concurrentemente y realizar rollbacks si ocurre un fallo.

### Mejores prácticas en Servicios:
- Nunca inyectes el objeto HTTP `Request` dentro de un Servicio. Pasa arreglos puros (`array $data`) o Data Transfer Objects (DTOs). El servicio debe ser agnóstico del protocolo web.
- Nombra los métodos descriptivamente: `getFilteredProducts()`, `createOrder()`, `getMasterCategories()`.

---

## 5. Convenciones de Nombrado y Estandarización

Para asegurar la legibilidad por distintos ingenieros de software, se establecen las siguientes convenciones:

- **Controladores y Servicios:** Nombre en Inglés y en Singular (`OrderController`, `ProductService`).
- **Modelos de Eloquent:** En Español y en Singular (`Producto`, `Orden`, `Categoria`), para que representen de manera natural la Base de Datos que está esquematizada en Español.
- **Rutas API/Web:** URLs en plural. Web pueden ser Inglés (`/products`) y API en español (`/api/productos`) si así se requiere para consumo público, pero el código fuente interno usa las clases en Inglés.

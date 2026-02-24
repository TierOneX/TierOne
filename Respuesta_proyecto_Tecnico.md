# 🎮 Respuestas Técnicas del Proyecto TierOne

Este documento detalla las respuestas a las preguntas planteadas sobre el desarrollo, diseño y gestión del proyecto **TierOne**, basándose en la arquitectura actual (Laravel 11 + React + Inertia.js).

---

## 🎨 Bloque: Diseño de Interfaces Web (DIW)
*Accesibilidad, usabilidad y respuesta visual.*

### 1. ¿Qué pautas de accesibilidad (WCAG) se han tenido en cuenta en el diseño del proyecto?
Se han considerado principalmente los principios **POUR** (Perceptible, Operable, Comprensible, Robusto):
- **Contraste de color**: Uso de la paleta de Tailwind CSS (e.g., `text-gray-900` sobre `bg-white`) para asegurar legibilidad.
- **Navegación por teclado**: Implementación de estilos `focus-visible` en elementos interactivos (botones, inputs, enlaces) para usuarios que navegan sin ratón.
- **Semántica HTML**: Uso correcto de etiquetas (`<header>`, `<main>`, `<footer>`, `<nav>`) en lugar de `<div>` genéricos, facilitando la lectura por lectores de pantalla (Screen Readers).
- **Etiquetas en formularios**: Todos los inputs (`TextInput.jsx`) están asociados a su `InputLabel`.

### 2. Pasa un test de Lighthouse a la página de inicio en este momento y explícanos por qué has obtenido esa puntuación en Accesibilidad.
*(Simulación basada en análisis de código actual de `Welcome.jsx`)*
**Puntuación estimada: ~92/100**
- **Aciertos**:
  - La estructura semántica es correcta (`header`, `main`, `footer`).
  - Los contrastes de texto en modo claro son adecuados.
  - Los enlaces tienen texto descriptivo.
- **Puntos de mejora detectados**:
  - **Falta de texto alternativo (`alt`)**: La imagen de fondo SVG (`background.svg`) en la línea 23 no tiene atributo `alt` o `role="presentation"`. Esto penaliza la puntuación ya que los lectores de pantalla intentarán leer el nombre del archivo.
  - **Contraste en modo oscuro**: Algunos textos con opacidad (`text-white/50`) podrían no cumplir el ratio 4.5:1 en ciertos monitores.

### 3. ¿Qué recursos tecnológicos usas para que la web sea "Responsive"?
Utilizamos **Tailwind CSS** y su sistema de *breakpoints* móviles-first:
- Clases de prefijo (`sm:`, `md:`, `lg:`, `xl:`).
- Diseño de rejilla flexible (`grid grid-cols-1 lg:grid-cols-3`).
- Unidades relativas (`rem`, `%`) en lugar de píxeles fijos para anchos de contenedores.
- Componentes como `ResponsiveNavLink.jsx` diseñados específicamente para menús móviles.

### 4. Abre las herramientas de desarrollador, con la vista de "Phone" y dinos qué pautas sigues para que el contenido sea legible.
- **Tamaño de fuente base**: Mínimo de 16px para evitar zoom automático en iOS.
- **Áreas táctiles**: Botones y enlaces con `padding` suficiente (min 44x44px en área touch, logrado con clases como `px-4 py-2`).
- **Espaciado vertical**: Aumento de `gap` y `margin-bottom` en móvil para separar elementos apilados.
- **Evitar scroll horizontal**: Uso de `w-full` y `max-w-screen` para asegurar que nada desborde el ancho del dispositivo.

### 5. ¿Crees que un usuario con ceguera total podría navegar bien por tu página? ¿Qué le facilitaría la navegación?
**Parcialmente.** Podría navegar, pero encontraría barreras.
- **Facilitadores actuales**: Etiquetas semánticas y labels en formularios.
- **Faltas**: Probablemente faltan atributos `aria-label` en botones que son solo íconos (como el botón para cambiar modo oscuro si existiera, o iconos sociales). Se beneficiaría de enlaces "Saltar al contenido" (Skip to content) al inicio del `body`, que actualmente no están implementados en el Layout.

### 6. IMPORTANCIA DEL MÓVIL Y EJEMPLOS
Es crítico porque más del **60% del tráfico web** global proviene de móviles. Google usa "Mobile-First Indexing".
- **Ejemplo en TierOne**: El menú de navegación (`AuthenticatedLayout.jsx`) colapsa en un "menú hamburguesa" en pantallas pequeñas, transformando una barra horizontal en un menú vertical desplegable (`ResponsiveNavLink`), facilitando el acceso con el pulgar.

### 7. Tres elementos que hacen el proyecto accesible
1.  **Estados de Foco Visibles**: Uso de `ring-1 ring-transparent focus-visible:ring-[#FF2D20]` para indicar claramente dónde está el foco del teclado.
2.  **Mensajes de Error Claros**: Componente `InputError.jsx` que vincula errores de validación directamente bajo el campo afectado, con texto rojo legible.
3.  **HTML Semántico**: Estructura de documento lógica (`h2` dentro de secciones, listas `ul/li` para menús).

### 8. Puntos de usabilidad relacionados con accesibilidad
- **Consistencia Visual**: Los botones (`PrimaryButton`, `SecondaryButton`) mantienen el mismo aspecto y comportamiento en toda la app, reduciendo la carga cognitiva.
- **Feedback Inmediato**: Al enviar un formulario (ej. Login), el estado de carga (`processing`) deshabilita el botón, previniendo envíos dobles y confirmando la acción al usuario.

### 9. Dificultad logrando usabilidad/accesibilidad
Implementar el **modo oscuro** (Dark Mode) correctamente fue un reto. Asegurar que todos los contrastes cumplieran WCAG tanto en fondo blanco como en `zinc-900` requirió revisar y ajustar muchas clases de Tailwind (`dark:text-white/70`), ya que colores que funcionan en claro a veces vibran o son ilegibles en oscuro.

### 10. Evaluación de usabilidad
- **General**: Una web usable es eficiente, efectiva y satisfactoria. El usuario logra su objetivo sin frustración.
- **En TierOne**: Evaluaríamos observando a un usuario nuevo intentar "Comprar un producto" o "Inscribirse a un torneo". Si dudan o se pierden, hay un fallo de usabilidad. Métricas: Tasa de éxito en tarea y tiempo medio por tarea.

---

## 💻 Bloque: Desarrollo Web Entorno Cliente (DWEC)
*Lógica JavaScript, React y el DOM.*

### 1. ¿Cómo gestionáis el estado de la aplicación en el Frontend?
Utilizamos una **estrategia híbrida** gracias a **Inertia.js**:
- **Estado de Página (Server State)**: Los datos principales (usuario autenticado, productos, torneos) vienen inyectados desde el backend (Laravel) como **Props** a los componentes de página. No necesitamos Redux/Zustand para datos globales complejos porque Inertia actualiza las props al navegar.
- **Estado UI Local**: Usamos el hook `useState` de React para interacciones locales (abrir/cerrar modales, contenido de formularios, toggles de filtros).

### 2. Consumo de API y manejo de Promesas
En lugar de `fetch` o `axios` manual, usamos el **Link de Inertia** y el helper **router** (`@inertiajs/react`).
- **Navegación**: `<Link href={route('login')}>` realiza una petición XHR por debajo.
- **Formularios**: Usamos el hook `useForm` de Inertia.
  ```javascript
  const { data, post, processing } = useForm({ email: '' });
  // Al enviar:
  post(route('login'), {
      onSuccess: () => reset(), // Promesa manejada internamente
  });
  ```
- Inertia usa Axios internamente, manejando las promesas y errores, recargando solo las partes necesarias de la página.

### 3. Estrategia de renderizado (SPA vs SSR)
Utilizamos una **Arquitectura SPA (Single Page Application) Monolítica** impulsada por Inertia.
- **Por qué**: Permite la experiencia fluida de una SPA (sin recargas de página completa) pero manteniendo la simplicidad de desarrollo de un monolito clásico (routing y controladores de Laravel).
- No es SSR puro (Node.js renderizando HTML), sino que Laravel sirve la primera vista y luego JS hidrata la app.

### 4. Validación de formularios en el cliente
Realizamos una **validación de doble capa**:
1.  **Cliente (Inmediata)**: Usamos atributos HTML5 (`required`, `type="email"`) y lógica en `useState` para deshabilitar botones si los campos están vacíos.
2.  **Servidor (Feedback)**: La validación real y segura ocurre en Laravel (FormRequests). Si falla, Laravel devuelve errores `422 Unprocessable Entity` que Inertia inyecta automáticamente en las props `errors` del componente React, mostrándolos con `<InputError message={errors.email} />`.

### 5. Componentes reutilizables y comunicación (Props/Events)
Seguimos el principio de **Componentes Atómicos**:
- **Componentes UI**: `PrimaryButton`, `TextInput`, `Modal`. Son "tontos" (stateless), reciben datos por `props` (`className`, `children`) y emiten eventos nativos (`onClick`, `onChange`).
- **Comunicación**: Flujo unidireccional (Padre -> Hijo).
  - El Padre pasa datos: `<TextInput value={data.name} />`
  - El Padre pasa callbacks para recibir info: `<TextInput onChange={(e) => setData('name', e.target.value)} />`

### 6. Enrutamiento (Routing) en el cliente
Es **míxto**.
- Las rutas se definen estrictamente en el Backend (**`routes/web.php`**).
- En el cliente, no usamos `react-router`. Inertia intercepta los clics en enlaces, hace una petición AJAX a Laravel, recibe el JSON de respuesta (nombre del componente React + props) y sustituye el componente página dinámicamente sin refrescar el navegador. Esto mantiene la URL sincronizada con el historial del navegador.

---

## ⚙️ Bloque: Desarrollo Web Entorno Servidor (DWES)
*Backend, Base de Datos y Seguridad.*

### 1. Arquitectura del Backend y Patrón de Diseño
Seguimos el patrón **MVC (Modelo-Vista-Controlador)** típico de Laravel:
- **Modelo**: Clases Eloquent (`app/Models/Producto.php`) que representan tablas de la BD.
- **Controlador**: (`app/Http/Controllers/ProductoController.php`) Gestiona la lógica. Recibe la petición, consulta el modelo y devuelve una respuesta.
- **Vista**: En nuestro caso, la "Vista" es una respuesta JSON para Inertia que carga un componente React (`Inertia::render('Producto/Index')`).
- **Patrón Repository/Service**: (Si aplicara) Para lógica compleja de negocio, extraemos código de los controladores a Servicios.

### 2. Autenticación y Autorización
- **Autenticación**: Usamos **Laravel Breeze** y **Sanctum**. Gestiona sesiones tradicionales (cookies `laravel_session`) para la web SPA, lo que es más seguro contra XSS que almacenar JWTs en localStorage.
- **Autorización**: Usamos **Middleware** (`auth`, `verified`) en las rutas para proteger accesos. Para permisos granulares (ej. solo admin puede crear torneos), usamos **Policies** o checks de Roles en el User Model (`$user->rol === 'admin'`).

### 3. Validación de datos en el servidor
Utilizamos **Form Requests** (ej. `StoreProductoRequest`).
- Separamos la lógica de validación del controlador.
- Reglas definidas:
  ```php
  return [
      'nombre' => 'required|string|max:255',
      'precio' => 'required|numeric|min:0',
      'categoria_id' => 'exists:categorias,id' // Integridad referencial
  ];
  ```
- Esto asegura que NUNCA llegue "basura" a la base de datos o al controlador.

### 4. Optimización de consultas a BD
- **Eager Loading**: Uso de `with()` para solucionar el problema N+1.
  - *Incorrecto*: `foreach ($productos as $p) { echo $p->categoria->nombre; }` (N consultas).
  - *Correcto*: `$productos = Producto::with('categoria')->get();` (2 consultas).
- **Índices**: Las migraciones definen claves foráneas (`$table->foreignId(...)`) que MySQL indexa automáticamente, acelerando los JOINS.

### 5. Manejo de errores y excepciones
- **Try-Catch global**: Laravel captura excepciones no controladas y devuelve páginas de error 500 amigables (o JSON si es AJAX).
- **Bloques Try-Catch en Controladores**:
  ```php
  try {
      // lógica
  } catch (ModelNotFoundException $e) {
      return back()->withErrors('Producto no encontrado'); // 404
  } catch (\Exception $e) {
      Log::error($e); // Registrar error interno
      return back()->withErrors('Error inesperado'); // 500
  }
  ```

### 6. Seguridad contra inyecciones SQL y XSS
- **SQL Injection**: **Eloquent ORM** usa *PDO binding* por defecto. Al hacer `User::where('email', $input)->first()`, el `$input` se escapa automáticamente, haciendo imposibles las inyecciones SQL clásicas.
- **XSS (Cross-Site Scripting)**: React escapa automáticamente todo contenido renderizado entre `{ llaves }`. Si un usuario intenta guardar `<script>alert(1)</script>` como nombre, React lo renderizará como texto plano, no como HTML ejecutable.

---

## 🚀 Bloque: Proyecto Intermodular
*Gestión, despliegue y trabajo en equipo.*

### 1. Proceso de Despliegue (Deployment)
El proyecto se puede desplegar en plataformas PaaS como **Heroku**, **Railway** o un **VPS** (Ubuntu con Nginx).
- **Proceso típico**:
  1.  Push a rama `main`.
  2.  Webhook dispara build en servidor.
  3.  Scripts (`install.sh`): `composer install`, `npm install && npm run build`, `php artisan migrate --force`.
  4.  Servidor web apunta a carpeta `public/`.

### 2. Control de Versiones (Git) y Flujo (Gitflow)
Utilizamos un flujo basado en **Feature Branches**:
- Rama `main`/`master`: Código de producción estable.
- Ramas `feature/nombre-funcionalidad`: Ramas efímeras para desarrollo (ej. `feature/carrito-compras`).
- **Pull Requests (PR)**: Para fusionar una feature a main, se requiere revisión de código.
- **Tags**: Versionado semántico (v1.0.0) para releases.

### 3. Reparto de tareas (Scrum/Kanban)
- Usamos un tablero tipo **Kanban** (Trello/GitHub Projects) con columnas: *Backlog*, *To Do*, *In Progress*, *Review*, *Done*.
- Trabajamos en **Sprints** (ciclos cortos de 1-2 semanas) definidos en nuestras reuniones de planificación.
- Realizamos **Daily Reviews** (como se ve en la carpeta `docs/daily-reviews`) para desbloquear impedimentos.

### 4. Mayor reto técnico y solución
*Ejemplo sugerido:* **"La integración de la pasarela de pagos con el manejo de stock en tiempo real."**
- **Reto**: Evitar que dos usuarios compren el último producto al mismo tiempo mientras uno está pagando.
- **Solución**: Implementar transacciones de base de datos (`DB::transaction`) y bloqueos pesimistas o verificar stock nuevamente justo antes de confirmar el pago de Stripe.

### 5. Escalar a 100,000 usuarios
Cambios necesarios:
1.  **Caché**: Implementar **Redis** para cachear consultas frecuentes (ej. lista de productos) y sesiones.
2.  **Base de Datos**: Separar servidor de BD, usar Réplicas de Lectura (Read Replicas) para distribuir carga.
3.  **Colas (Queues)**: Mover tareas pesadas (enviar emails, procesar imágenes, generar reportes) a **Jobs** en segundo plano procesados por `Horizon`.
4.  **CDN**: Servir assets estáticos (imágenes, JS, CSS) desde un CDN (Cloudflare/AWS S3).

### Valoración Personal
Integrar Frontend y Backend en un solo flujo moderno (Inertia) ha sido revelador. He aprendido que la **experiencia de desarrollador (DX)**, como el tipado fuerte y la validación automática, impacta directamente en la calidad final del producto para el usuario. Entender el ciclo completo del dato, desde que el usuario hace clic hasta que se guarda en MySQL y vuelve, es la base de la ingeniería web real.

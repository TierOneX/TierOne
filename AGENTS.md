# AGENTS.md — TierOne

## Project Overview
Laravel 12 + React 18 + Inertia.js gaming e-commerce + tournament platform. All application code lives in `TierOne/` (not at repo root).

## Key Commands (run from `TierOne/`)
```
composer install          # PHP deps
npm install               # JS deps
php artisan serve         # Dev server (single-thread, slow — see Performance)
npm run dev               # Vite dev server (run in separate terminal)
npm run build             # Production bundle
php artisan migrate       # Run migrations
php artisan test          # Run PHPUnit
php artisan test --filter=Name  # Run single test
php artisan pint          # Format PHP code
```

## Architecture
- **Layered architecture**: Controllers → Services → Eloquent Models. Controllers must NOT contain business logic.
- **Controllers split**: `app/Http/Controllers/Web/` (Inertia views) vs `app/Http/Controllers/Api/` (JSON responses using `ApiResponseTrait`).
- **Models are in Spanish** (`Producto`, `Orden`, `Categoria`) — database schema is Spanish. **Controllers/Services are in English** (`ProductController`, `ProductService`).
- **Services** live in `app/Services/` — pass pure arrays/DTOs, never inject HTTP `Request`.
- **Entry point**: `resources/js/app.jsx` → Vite → Inertia renders React pages from `resources/js/Pages/`.

## Testing
- PHPUnit configured in `phpunit.xml`. Tests use **SQLite in-memory** for DB (`DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`).
- `php artisan test` runs all tests. Use `--filter` for specific test classes/methods.
- Test dirs: `tests/Unit`, `tests/Feature`.

## Environment
- DB name: `tierone_db` (MySQL). See `.env.example` for defaults.
- `QUEUE_CONNECTION=database`, `CACHE_STORE=database`, `SESSION_DRIVER=database` — no Redis needed for dev.
- Stripe config in `config/stripe.php`. Webhook endpoint: `POST /stripe/webhook`.

## Performance Gotcha
- `php artisan serve` is single-thread → slow page loads with Vite HMR. Known issue tracked in `TierOne/TODO.md`.
- Preferred dev: use XAMPP Apache with VirtualHost (`tierone.local`) for multi-thread performance.
- Production: `npm run build` + `php artisan optimize`.

## Scripts (run from repo root)
- `scripts/install/install.bat` — Windows one-step install
- `scripts/install/install.sh` — Linux/Mac one-step install
- `database/setup_mysql.sql` — Creates `tierone_db` database

## Module Boundaries
- **E-commerce**: Products, Categories, Orders, Cart, Reviews, Stripe payments, PDF invoices (DomPDF), product customization (Fabric.js canvas)
- **Tournaments**: Torneos, Partidas, Inscripciones, Resultados
- **Admin panels**: `/panel-admin-ecommerce/*` (e-commerce admin), tournament admin routes in API
- **Auth**: Laravel Breeze + Sanctum for API tokens

## Conventions
- Routes: Web routes may use English slugs (`/products`), API routes use Spanish (`/api/productos`).
- Invoice PDFs: `InvoiceService` generates via DomPDF with base64 logo. Template at `resources/views/pdf/invoice.blade.php`.
- Customization: Uses `fabric` npm package for canvas editor. Image upload + render save via `CustomizationController`.

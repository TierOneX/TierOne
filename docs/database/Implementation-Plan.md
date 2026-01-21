# Plan de Implementación de Base de Datos - TierOne

## Descripción General

Este documento detalla el plan de implementación de la base de datos para el proyecto TierOne, un sistema Laravel que integra funcionalidades de **E-commerce**, **Torneos** y **Pagos con Stripe**.

---

## Tecnología y Configuración

### Stack Actual
- **Framework**: Laravel (PHP)
- **Base de datos por defecto**: SQLite
- **Opciones disponibles**: MySQL, MariaDB, PostgreSQL, SQL Server
- **ORM**: Eloquent

### Recomendación de Migración
> [!IMPORTANT]
> Se recomienda migrar de SQLite a **MySQL** o **PostgreSQL** para producción, ya que SQLite tiene limitaciones para aplicaciones con múltiples usuarios concurrentes y transacciones complejas.

---

## Módulos del Sistema

### 1. Módulo E-commerce
Gestión completa de productos, inventario, pedidos, clientes y notificaciones.

### 2. Módulo Torneos
Administración de torneos deportivos, equipos, partidos, clasificaciones y resultados.

### 3. Módulo Pagos (Stripe)
Procesamiento de pagos, gestión de métodos de pago, webhooks y reembolsos.

---

## Estructura de Tablas por Módulo

### 📦 Módulo E-commerce

#### Tabla: `users`
```sql
- id (PK)
- name
- email (unique)
- password
- role (enum: admin, customer)
- email_verified_at
- remember_token
- created_at
- updated_at
```

#### Tabla: `categories`
```sql
- id (PK)
- name
- slug (unique)
- description (nullable)
- parent_id (FK a categories, nullable)
- is_active (boolean)
- created_at
- updated_at
```

#### Tabla: `products`
```sql
- id (PK)
- category_id (FK a categories)
- name
- slug (unique)
- description
- price (decimal 10,2)
- cost_price (decimal 10,2, nullable)
- sku (unique)
- stock_quantity (integer)
- min_stock_level (integer, default: 10)
- is_active (boolean)
- featured (boolean)
- image_url (nullable)
- created_at
- updated_at
```

#### Tabla: `product_images`
```sql
- id (PK)
- product_id (FK a products)
- image_url
- is_primary (boolean)
- sort_order (integer)
- created_at
- updated_at
```

#### Tabla: `orders`
```sql
- id (PK)
- user_id (FK a users)
- order_number (unique)
- status (enum: pending, processing, completed, cancelled, refunded)
- subtotal (decimal 10,2)
- tax (decimal 10,2)
- shipping_cost (decimal 10,2)
- total (decimal 10,2)
- payment_status (enum: pending, paid, failed, refunded)
- payment_method
- stripe_payment_intent_id (nullable)
- shipping_address (json)
- billing_address (json)
- notes (text, nullable)
- created_at
- updated_at
```

#### Tabla: `order_items`
```sql
- id (PK)
- order_id (FK a orders)
- product_id (FK a products)
- quantity
- unit_price (decimal 10,2)
- subtotal (decimal 10,2)
- created_at
- updated_at
```

#### Tabla: `inventory_movements`
```sql
- id (PK)
- product_id (FK a products)
- type (enum: in, out, adjustment)
- quantity (integer)
- reason (nullable)
- reference_id (nullable) // ID de orden o ajuste
- user_id (FK a users)
- created_at
```

#### Tabla: `notifications`
```sql
- id (PK)
- user_id (FK a users, nullable)
- type (enum: order, stock, system)
- title
- message (text)
- is_read (boolean)
- data (json, nullable)
- created_at
- updated_at
```

---

### 🏆 Módulo Torneos

#### Tabla: `tournaments`
```sql
- id (PK)
- name
- slug (unique)
- description (text, nullable)
- sport_type (enum: football, basketball, tennis, etc.)
- tournament_type (enum: league, knockout, mixed)
- start_date
- end_date
- status (enum: draft, active, completed, cancelled)
- max_teams (integer, nullable)
- registration_deadline (datetime, nullable)
- rules (text, nullable)
- prize_pool (decimal 10,2, nullable)
- created_by (FK a users)
- created_at
- updated_at
```

#### Tabla: `teams`
```sql
- id (PK)
- tournament_id (FK a tournaments)
- name
- slug (unique)
- logo_url (nullable)
- captain_name
- contact_email
- contact_phone
- status (enum: pending, approved, rejected)
- created_at
- updated_at
```

#### Tabla: `players`
```sql
- id (PK)
- team_id (FK a teams)
- name
- jersey_number (integer, nullable)
- position (nullable)
- date_of_birth (date, nullable)
- is_captain (boolean)
- created_at
- updated_at
```

#### Tabla: `matches`
```sql
- id (PK)
- tournament_id (FK a tournaments)
- home_team_id (FK a teams)
- away_team_id (FK a teams)
- match_date (datetime)
- venue (nullable)
- round (integer, nullable)
- phase (enum: group, quarter, semi, final, nullable)
- status (enum: scheduled, live, completed, postponed, cancelled)
- home_score (integer, nullable)
- away_score (integer, nullable)
- winner_team_id (FK a teams, nullable)
- created_at
- updated_at
```

#### Tabla: `match_events`
```sql
- id (PK)
- match_id (FK a matches)
- player_id (FK a players, nullable)
- team_id (FK a teams)
- event_type (enum: goal, yellow_card, red_card, substitution, etc.)
- minute (integer)
- description (text, nullable)
- created_at
```

#### Tabla: `standings`
```sql
- id (PK)
- tournament_id (FK a tournaments)
- team_id (FK a teams)
- played (integer, default: 0)
- won (integer, default: 0)
- drawn (integer, default: 0)
- lost (integer, default: 0)
- goals_for (integer, default: 0)
- goals_against (integer, default: 0)
- goal_difference (integer, default: 0)
- points (integer, default: 0)
- position (integer, nullable)
- updated_at
```

---

### 💳 Módulo Pagos (Stripe)

#### Tabla: `payment_methods`
```sql
- id (PK)
- user_id (FK a users)
- stripe_payment_method_id (unique)
- type (enum: card, bank_account, wallet)
- brand (nullable) // visa, mastercard, etc.
- last4
- exp_month (integer, nullable)
- exp_year (integer, nullable)
- is_default (boolean)
- created_at
- updated_at
```

#### Tabla: `payments`
```sql
- id (PK)
- user_id (FK a users)
- order_id (FK a orders, nullable)
- tournament_id (FK a tournaments, nullable)
- stripe_payment_intent_id (unique)
- stripe_charge_id (nullable)
- amount (decimal 10,2)
- currency (varchar, default: 'eur')
- status (enum: pending, succeeded, failed, cancelled, refunded)
- payment_method_id (FK a payment_methods, nullable)
- description (nullable)
- metadata (json, nullable)
- created_at
- updated_at
```

#### Tabla: `refunds`
```sql
- id (PK)
- payment_id (FK a payments)
- stripe_refund_id (unique)
- amount (decimal 10,2)
- reason (enum: duplicate, fraudulent, requested_by_customer, other)
- status (enum: pending, succeeded, failed)
- created_at
- updated_at
```

#### Tabla: `stripe_webhooks`
```sql
- id (PK)
- stripe_event_id (unique)
- type (varchar) // payment_intent.succeeded, etc.
- payload (json)
- processed (boolean)
- processed_at (datetime, nullable)
- error_message (text, nullable)
- created_at
```

---

## Plan de Implementación

### Fase 1: Preparación del Entorno

#### 1.1 Configurar Base de Datos
```bash
# Opción A: Continuar con SQLite (desarrollo)
php artisan migrate

# Opción B: Migrar a MySQL (recomendado para producción)
# Actualizar .env:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tierone_db
DB_USERNAME=root
DB_PASSWORD=tu_password
```

#### 1.2 Instalar Dependencias
```bash
# Instalar paquete de Stripe
composer require stripe/stripe-php

# Instalar paquete de Laravel Cashier (opcional, facilita integración con Stripe)
composer require laravel/cashier
```

---

### Fase 2: Crear Migraciones

#### 2.1 Módulo E-commerce
```bash
php artisan make:migration create_categories_table
php artisan make:migration create_products_table
php artisan make:migration create_product_images_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan make:migration create_inventory_movements_table
php artisan make:migration create_notifications_table
```

#### 2.2 Módulo Torneos
```bash
php artisan make:migration create_tournaments_table
php artisan make:migration create_teams_table
php artisan make:migration create_players_table
php artisan make:migration create_matches_table
php artisan make:migration create_match_events_table
php artisan make:migration create_standings_table
```

#### 2.3 Módulo Pagos
```bash
php artisan make:migration create_payment_methods_table
php artisan make:migration create_payments_table
php artisan make:migration create_refunds_table
php artisan make:migration create_stripe_webhooks_table
```

---

### Fase 3: Crear Modelos Eloquent

#### 3.1 Estructura de Modelos
```bash
# E-commerce
php artisan make:model Category
php artisan make:model Product
php artisan make:model ProductImage
php artisan make:model Order
php artisan make:model OrderItem
php artisan make:model InventoryMovement
php artisan make:model Notification

# Torneos
php artisan make:model Tournament
php artisan make:model Team
php artisan make:model Player
php artisan make:model Match
php artisan make:model MatchEvent
php artisan make:model Standing

# Pagos
php artisan make:model PaymentMethod
php artisan make:model Payment
php artisan make:model Refund
php artisan make:model StripeWebhook
```

#### 3.2 Definir Relaciones Eloquent

**Ejemplo: Modelo Product**
```php
class Product extends Model
{
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function inventoryMovements()
    {
        return $this->hasMany(InventoryMovement::class);
    }
}
```

---

### Fase 4: Seeders y Datos de Prueba

#### 4.1 Crear Seeders
```bash
php artisan make:seeder UserSeeder
php artisan make:seeder CategorySeeder
php artisan make:seeder ProductSeeder
php artisan make:seeder TournamentSeeder
```

#### 4.2 Ejecutar Seeders
```bash
php artisan db:seed
```

---

### Fase 5: Configuración de Stripe

#### 5.1 Variables de Entorno
```env
STRIPE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### 5.2 Configurar Webhooks
- URL del webhook: `https://tu-dominio.com/stripe/webhook`
- Eventos a escuchar:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`
  - `customer.subscription.created`

---

## Índices y Optimización

### Índices Recomendados

```sql
-- Productos
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Órdenes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Torneos
CREATE INDEX idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX idx_matches_match_date ON matches(match_date);
CREATE INDEX idx_standings_tournament_id ON standings(tournament_id);

-- Pagos
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
```

---

## Backups y Seguridad

### Estrategia de Backup
```bash
# Backup diario automático
0 2 * * * mysqldump -u root -p tierone_db > /backups/tierone_$(date +\%Y\%m\%d).sql
```

### Seguridad
> [!CAUTION]
> - Nunca almacenar información de tarjetas de crédito directamente
> - Usar Stripe para manejar datos sensibles de pago
> - Implementar validación de datos en modelos y controladores
> - Usar transacciones de base de datos para operaciones críticas

---

## Testing

### Tests de Base de Datos
```bash
# Crear tests
php artisan make:test ProductTest
php artisan make:test OrderTest
php artisan make:test TournamentTest

# Ejecutar tests
php artisan test
```

---

## Cronograma Estimado

| Fase | Duración Estimada | Prioridad |
|------|-------------------|-----------|
| Fase 1: Preparación | 1 día | Alta |
| Fase 2: Migraciones | 2-3 días | Alta |
| Fase 3: Modelos | 2 días | Alta |
| Fase 4: Seeders | 1 día | Media |
| Fase 5: Stripe | 2 días | Alta |
| Testing | 2 días | Alta |
| **TOTAL** | **10-11 días** | - |

---

## Próximos Pasos

1. [ ] Decidir base de datos definitiva (SQLite vs MySQL/PostgreSQL)
2. [ ] Crear todas las migraciones del módulo E-commerce
3. [ ] Crear todas las migraciones del módulo Torneos
4. [ ] Crear todas las migraciones del módulo Pagos
5. [ ] Definir modelos Eloquent con relaciones
6. [ ] Implementar seeders para datos de prueba
7. [ ] Configurar integración con Stripe
8. [ ] Crear tests unitarios y de integración
9. [ ] Documentar API endpoints
10. [ ] Implementar sistema de backups automáticos

---

## Referencias

- [Documentación de Laravel Migrations](https://laravel.com/docs/migrations)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Stripe PHP SDK](https://stripe.com/docs/api/php)
- [Laravel Cashier](https://laravel.com/docs/billing)

---

**Última actualización**: 2026-01-19  
**Versión**: 1.0  
**Autor**: TierOne Development Team

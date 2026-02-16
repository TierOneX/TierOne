# 📚 Documentación de Rutas API - TierOne

**Versión:** 1.0  
**Base URL:** `http://localhost:8000/api`  
**Autenticación:** Laravel Sanctum (Bearer Token)

---

## 🔐 Autenticación

Todas las rutas protegidas requieren un token de autenticación en el header:

```http
Authorization: Bearer {tu-token-aqui}
```

### Obtener Token

**Endpoint:** `POST /login` (definido en `auth.php`)

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz",
  "user": { ... }
}
```

---

## 📋 **ÍNDICE DE RECURSOS**

| Recurso | Autenticación | Descripción |
|---------|--------------|-------------|
| [Productos](#-productos) | Mixto | Catálogo de productos |
| [Categorías](#-categorías) | Mixto | Categorías de productos |
| [Juegos](#-juegos) | Mixto | Juegos disponibles |
| [Torneos](#-torneos) | Mixto | Sistema de torneos |
| [Usuarios](#-usuarios) | Protegido | Gestión de usuarios (Admin) |
| [Proveedores](#-proveedores) | Protegido | Gestión de proveedores |
| [Partidas](#-partidas) | Protegido | Partidas de torneos |
| [Inscripciones](#-inscripciones-torneo) | Protegido | Inscripciones a torneos |
| [Órdenes](#-órdenes) | Protegido | Órdenes de compra |
| [Carritos](#-carritos) | Protegido | Carrito de compras |
| [Direcciones Envío](#-direcciones-de-envío) | Protegido | Direcciones del usuario |
| [Reviews](#-reviews) | Protegido | Reseñas de productos |
| [Reportes](#-reportes) | Protegido | Estadísticas y reportes |

---

## 📦 **PRODUCTOS**

### 🌐 Rutas Públicas

#### Listar Productos
```http
GET /api/productos
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Productos obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "nombre": "Camiseta Gaming",
      "precio_venta": 29.99,
      "categoria": { ... },
      "proveedor": { ... }
    }
  ]
}
```

#### Ver Producto
```http
GET /api/productos/{id}
```

**Parámetros:**
- `id` (integer): ID del producto

---

### 🔒 Rutas Protegidas (Admin/Staff)

#### Crear Producto
```http
POST /api/productos
Authorization: Bearer {token}
```

**Body:**
```json
{
  "id_categoria": 1,
  "id_proveedor": 2,
  "nombre": "Mouse RGB Gaming",
  "slug": "mouse-rgb-gaming",
  "descripcion": "Mouse profesional con iluminación RGB",
  "precio_proveedor": 25.00,
  "precio_venta": 45.99,
  "imagen_principal": "images/mouse-rgb.jpg",
  "destacado": true,
  "activo": true
}
```

#### Actualizar Producto
```http
PUT /api/productos/{id}
Authorization: Bearer {token}
```

#### Eliminar Producto
```http
DELETE /api/productos/{id}
Authorization: Bearer {token}
```

---

## 🏷️ **CATEGORÍAS**

### 🌐 Ruta Pública

```http
GET /api/categorias
```

### 🔒 Rutas Protegidas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/categorias` | Crear categoría |
| GET | `/api/categorias/{id}` | Ver categoría |
| PUT | `/api/categorias/{id}` | Actualizar categoría |
| DELETE | `/api/categorias/{id}` | Eliminar categoría |

**Ejemplo Body (POST/PUT):**
```json
{
  "id_parent": null,
  "nombre": "Accesorios Gaming",
  "slug": "accesorios-gaming",
  "descripcion": "Periféricos y accesorios",
  "activa": true
}
```

---

## 🎮 **JUEGOS**

### 🌐 Ruta Pública

```http
GET /api/juegos
```

### 🔒 Rutas Protegidas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/juegos` | Crear juego |
| GET | `/api/juegos/{id}` | Ver juego |
| PUT | `/api/juegos/{id}` | Actualizar juego |
| DELETE | `/api/juegos/{id}` | Eliminar juego |

---

## 🏆 **TORNEOS**

### 🌐 Ruta Pública

```http
GET /api/torneos
```

Retorna torneos públicos/activos.

### 🔒 Rutas Protegidas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/torneos` | Crear torneo |
| GET | `/api/torneos/{id}` | Ver torneo |
| PUT | `/api/torneos/{id}` | Actualizar torneo |
| DELETE | `/api/torneos/{id}` | Eliminar torneo |

**Ejemplo Body:**
```json
{
  "id_juego": 1,
  "nombre": "Torneo League of Legends 2026",
  "descripcion": "Torneo de primavera",
  "fecha_inicio": "2026-03-01",
  "fecha_fin": "2026-03-15",
  "max_participantes": 32,
  "premio": "500 EUR",
  "estado": "abierto"
}
```

---

## 👥 **USUARIOS**

🔒 **Todas las rutas requieren autenticación** (Solo Admin)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar usuarios |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/{id}` | Ver usuario |
| PUT | `/api/users/{id}` | Actualizar usuario |
| DELETE | `/api/users/{id}` | Eliminar usuario |

### Usuario Autenticado

```http
GET /api/user
Authorization: Bearer {token}
```

Retorna información del usuario logueado.

---

## 🏪 **PROVEEDORES**

🔒 **Todas las rutas requieren autenticación** (Admin/Staff)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/proveedores` | Listar proveedores |
| POST | `/api/proveedores` | Crear proveedor |
| GET | `/api/proveedores/{id}` | Ver proveedor |
| PUT | `/api/proveedores/{id}` | Actualizar proveedor |
| DELETE | `/api/proveedores/{id}` | Eliminar proveedor |

---

## 🎯 **PARTIDAS**

🔒 **Todas las rutas requieren autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/partidas` | Listar partidas |
| POST | `/api/partidas` | Crear partida |
| GET | `/api/partidas/{id}` | Ver partida |
| PUT | `/api/partidas/{id}` | Actualizar partida |
| DELETE | `/api/partidas/{id}` | Eliminar partida |

---

## 📝 **INSCRIPCIONES TORNEO**

🔒 **Todas las rutas requieren autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/inscripciones-torneo` | Listar inscripciones |
| POST | `/api/inscripciones-torneo` | Inscribirse a torneo |
| GET | `/api/inscripciones-torneo/{id}` | Ver inscripción |
| PUT | `/api/inscripciones-torneo/{id}` | Actualizar inscripción |
| DELETE | `/api/inscripciones-torneo/{id}` | Cancelar inscripción |

**Ejemplo Body (POST):**
```json
{
  "id_torneo": 1,
  "id_user": 5,
  "estado": "confirmada"
}
```

---

## 🛒 **ÓRDENES**

🔒 **Todas las rutas requieren autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ordenes` | Listar órdenes del usuario |
| POST | `/api/ordenes` | Crear orden |
| GET | `/api/ordenes/{id}` | Ver orden |
| PUT | `/api/ordenes/{id}` | Actualizar orden |
| DELETE | `/api/ordenes/{id}` | Cancelar orden |

**Ejemplo Body (POST):**
```json
{
  "id_user": 5,
  "id_direccion_envio": 2,
  "subtotal": 89.97,
  "impuestos": 18.89,
  "total": 108.86,
  "estado": "pendiente"
}
```

---

## 🛍️ **CARRITOS**

🔒 **Todas las rutas requieren autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/carritos` | Ver carrito del usuario |
| POST | `/api/carritos` | Añadir al carrito |
| GET | `/api/carritos/{id}` | Ver item del carrito |
| PUT | `/api/carritos/{id}` | Actualizar cantidad |
| DELETE | `/api/carritos/{id}` | Eliminar del carrito |

---

## 📍 **DIRECCIONES DE ENVÍO**

🔒 **Todas las rutas requieren autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/direcciones-envio` | Listar direcciones |
| POST | `/api/direcciones-envio` | Añadir dirección |
| GET | `/api/direcciones-envio/{id}` | Ver dirección |
| PUT | `/api/direcciones-envio/{id}` | Actualizar dirección |
| DELETE | `/api/direcciones-envio/{id}` | Eliminar dirección |

**Ejemplo Body:**
```json
{
  "id_user": 5,
  "nombre_completo": "Juan Pérez",
  "direccion": "Calle Mayor 123",
  "ciudad": "Madrid",
  "codigo_postal": "28001",
  "pais": "España",
  "telefono": "+34 600 123 456",
  "predeterminada": true
}
```

---

## ⭐ **REVIEWS**

🔒 **Todas las rutas requieren autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reviews` | Listar reviews |
| POST | `/api/reviews` | Crear review |
| GET | `/api/reviews/{id}` | Ver review |
| PUT | `/api/reviews/{id}` | Actualizar review |
| DELETE | `/api/reviews/{id}` | Eliminar review |

**Ejemplo Body:**
```json
{
  "id_producto": 1,
  "id_user": 5,
  "puntuacion": 5,
  "comentario": "Excelente producto, muy recomendable"
}
```

---

## 📊 **REPORTES**

🔒 **Todas las rutas requieren autenticación** (Solo Admin)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reportes` | Listar reportes disponibles |
| POST | `/api/reportes` | Generar reporte |
| GET | `/api/reportes/{id}` | Ver reporte |
| PUT | `/api/reportes/{id}` | Actualizar reporte |
| DELETE | `/api/reportes/{id}` | Eliminar reporte |

---

## 🚨 **CÓDIGOS DE RESPUESTA**

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - Token inválido o faltante |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 422 | Validation Error - Error de validación |
| 500 | Server Error - Error del servidor |

---

## 📌 **ESTRUCTURA DE RESPUESTAS**

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Error al procesar la petición",
  "errors": {
    "campo": ["Mensaje de error"]
  }
}
```

---

## 🔧 **TESTING**

Para probar los endpoints usa:

**Postman/Insomnia:**
- Importa la colección desde `docs/postman_collection.json`

**Terminal (curl):**
```bash
# Endpoint público
curl http://localhost:8000/api/productos

# Endpoint protegido
curl -H "Authorization: Bearer TU_TOKEN" \
     http://localhost:8000/api/ordenes
```

---

**Última actualización:** 2026-02-09  
**Contacto:** TierOne Development Team

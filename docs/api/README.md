# 🔌 API - TierOne

Documentación de endpoints, autenticación y integración con APIs externas.

---

## 📚 Contratos API

Documentación detallada de los endpoints por módulo. Usar estos contratos como referencia para el desarrollo Frontend y Backend.

### 🔐 Autenticación
- [Auth API Contract](contracts/Auth-API.md) - Login, Registro, Logout, Recuperar Password.

### 👥 Usuarios
- [Users API Contract](contracts/Users-API.md) - Gestión de usuarios, perfiles, administración.

### 👾 Juegos y Partidas
- [Games API Contract](contracts/Games-API.md) - Catálogo de juegos, Sincronización.
- [Matches API Contract](contracts/Matches-API.md) - Creación de partidas, Resultados, Disputas.

### 🏆 Torneos
- [Tournaments API Contract](contracts/Tournaments-API.md) - Brackets, Inscripciones, Premios.

### 🛍️ E-Commerce
- [Shop API Contract](contracts/Shop-API.md) - Productos, Carrito, Orders.
- [Cart API Contract](contracts/Cart-API.md) - Gestión del carrito de compras.
- [Reviews API Contract](contracts/Reviews-API.md) - Reseñas de productos con moderación.

---

## 🛠️ Herramientas

- **Plantilla**: Usa la [_TEMPLATE.md](contracts/_TEMPLATE.md) para crear nuevos contratos.
- **Postman**: (Link a colección de Postman si existe)
- **Swagger UI**: (URL si se implementa)

---

## 📡 Estándares Generales

### Base URL
Todos los endpoints están bajo el prefijo: `/api/v1`

### Autenticación
Se utiliza **Laravel Sanctum**. Enviar el token en el header:
`Authorization: Bearer <token>`

### Respuestas de Error
Formato estándar para errores de validación (422):
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "field_name": ["Error description"]
    }
}
```

---

## 📚 Navegación

- **[← Volver al Hub de Documentación](../README.md)**
- **[📊 Ver Diagrams de Flujo](../diagrams/README.md)**
- **[🗄️ Ver Documentación de Base de Datos](../database/README.md)**

---

**Estado**: 🚧 En Desarrollo - 15 controladores implementados  
**Última actualización**: Febrero 2026

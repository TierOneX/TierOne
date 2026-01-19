# 🗄️ Base de Datos - TierOne

Documentación completa del diseño, implementación y gestión de la base de datos para TierOne.

---

## 📋 Documentos Disponibles

### 📊 [Diagrama Entidad-Relación](ER-Diagram.md)
Diagrama ER completo con todas las tablas y relaciones del sistema.

**Contenido**:
- 27 tablas organizadas en 6 módulos
- Relaciones entre entidades
- Campos y tipos de datos
- Restricciones y claves

**Módulos cubiertos**:
- Usuarios y Autenticación
- Gestión de Juegos
- Partidas Competitivas (API sync)
- Torneos con Sponsors
- E-Commerce con Dropshipping
- Gestión Financiera

---

### 📝 [Plan de Implementación](Implementation-Plan.md)
Guía paso a paso para implementar la base de datos relacional.

**Contenido**:
- Configuración de base de datos
- Creación de migraciones Laravel
- Definición de modelos Eloquent
- Seeders y datos de prueba
- Índices y optimización
- Cronograma estimado

---

### 🔍 [Análisis y Correcciones](Analysis-Corrections.md)
Análisis detallado con 20 correcciones y mejoras identificadas.

**Contenido**:
- 5 correcciones críticas
- 10 correcciones importantes
- 5 mejoras opcionales
- Plan de acción priorizado

**Correcciones críticas**:
1. Agregar campo `balance` a tabla `USERS`
2. Crear tabla `EQUIPOS` (faltante)
3. Corregir campo `id_referencia` en `TRANSACCIONES`
4. Eliminar campo calculado `margen` de `PRODUCTOS`
5. Refactorizar `COMUNICACIONES_PROVEEDOR`

---

### 🍃 [Integración MongoDB](MongoDB-Integration.md)
Plan de integración de MongoDB con arquitectura híbrida.

**Contenido**:
- Arquitectura híbrida recomendada
- Configuración de MongoDB (local y Atlas)
- Casos de uso para MongoDB vs MySQL
- Ejemplos de modelos
- Guía de instalación

**Arquitectura híbrida**:
- **MySQL/PostgreSQL**: Datos críticos (usuarios, pedidos, pagos)
- **MongoDB**: Datos flexibles (reviews, carritos, logs, sesiones)

---

## 🎯 Inicio Rápido

### 1. Entender el Diseño
Comienza revisando el [Diagrama ER](ER-Diagram.md) para familiarizarte con la estructura.

### 2. Revisar Correcciones
Lee el [Análisis de Correcciones](Analysis-Corrections.md) para conocer las mejoras necesarias.

### 3. Implementar
Sigue el [Plan de Implementación](Implementation-Plan.md) para crear la base de datos.

### 4. (Opcional) MongoDB
Si necesitas MongoDB, consulta la [Guía de Integración](MongoDB-Integration.md).

---

## 📊 Estadísticas

- **Total de tablas**: 27
- **Módulos**: 6
- **Relaciones**: 45+
- **Correcciones identificadas**: 20

---

## 🔧 Tecnologías

- **Base de datos relacional**: MySQL / PostgreSQL
- **ORM**: Laravel Eloquent
- **Migraciones**: Laravel Migrations
- **NoSQL (opcional)**: MongoDB

---

## 📝 Convenciones de Nomenclatura

### Tablas
- Nombres en **MAYÚSCULAS** en diagramas
- Nombres en **snake_case** en código
- Plural para tablas (ej: `users`, `products`)

### Campos
- **snake_case** para nombres de campos
- Prefijo `id_` para foreign keys
- Sufijo `_at` para timestamps
- Sufijo `_url` para URLs

### Relaciones
- `belongsTo` / `hasMany` en Eloquent
- Foreign keys con `ON DELETE CASCADE` cuando corresponda

---

## 🚀 Próximos Pasos

1. [ ] Implementar correcciones críticas
2. [ ] Crear migraciones Laravel
3. [ ] Definir modelos Eloquent
4. [ ] Crear seeders de prueba
5. [ ] Configurar índices
6. [ ] (Opcional) Integrar MongoDB

---

## 🔗 Enlaces Relacionados

- [← Volver al Hub Principal](../README.md)
- [API Documentation](../api/README.md)
- [Frontend Documentation](../frontend/README.md)

---

**Última actualización**: 2026-01-19  
**Versión**: 1.0  
**Estado**: ✅ Documentación completa

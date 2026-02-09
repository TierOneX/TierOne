# 🔐 Authentication API Contract

**Base URL**: `/api/v1/auth`  
**Versión**: 1.0  
**Estado**: 🚧 Borrador

---

## 📋 Índice de Endpoints

| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `POST` | `/login` | Iniciar sesión | 🔓 |
| `POST` | `/register` | Registrar nuevo usuario | 🔓 |
| `POST` | `/logout` | Cerrar sesión | 🔒 |
| `GET` | `/user` | Obtener usuario actual | 🔒 |
| `POST` | `/forgot-password` | Solicitar reset password | 🔓 |

---

## 📝 Definición de Endpoints

### 1. Iniciar Sesión

**Descripción**: Autentica un usuario mediante email y password y devuelve un token de acceso.

- **URL**: `/api/v1/auth/login`
- **Método**: `POST`
- **Autenticación**: Pública

#### 📩 Request

**Body Parameters**

| Campo | Tipo | Requerido | Descripción | Reglas |
|-------|------|:---------:|-------------|--------|
| `email` | String | ✅ | Email del usuario | Valid email |
| `password` | String | ✅ | Contraseña | Min 8 chars |
| `device_name` | String | ❌ | Nombre del dispositivo | Para identificar token |

**Ejemplo Body**
```json
{
  "email": "player@tierone.com",
  "password": "password123",
  "device_name": "iPhone 13"
}
```

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "token": "1|7D9s8f7D9s8f7D9s8f...",
  "user": {
    "id": 1,
    "username": "ProGamer",
    "email": "player@tierone.com",
    "rol": "player"
  }
}
```

**❌ Errors**

| Código | Descripción |
|:------:|-------------|
| `422` | Credenciales inválidas |

---

### 2. Registrar Usuario

**Descripción**: Crea una nueva cuenta de usuario en la plataforma.

- **URL**: `/api/v1/auth/register`
- **Método**: `POST`
- **Autenticación**: Pública

#### 📩 Request

**Body Parameters**

| Campo | Tipo | Requerido | Descripción | Reglas |
|-------|------|:---------:|-------------|--------|
| `username` | String | ✅ | Nombre de usuario único | Unique, Min 3 |
| `email` | String | ✅ | Email válido | Unique, Email |
| `password` | String | ✅ | Contraseña | Min 8, Confirmed |
| `password_confirmation`| String | ✅ | Confirmación de password | Same as password |
| `pais` | String | ✅ | Código ISO país | Len 2 |

**Ejemplo Body**
```json
{
  "username": "NewChallenger",
  "email": "new@tierone.com",
  "password": "password123",
  "password_confirmation": "password123",
  "pais": "ES"
}
```

#### 📤 Response

**✅ Success (201 Created)**

```json
{
  "token": "2|8E0t9g8E0t9g...",
  "user": {
    "id": 2,
    "username": "NewChallenger",
    "email": "new@tierone.com",
    "rol": "player",
    "balance_disponible": 0
  }
}
```

---

### 3. Obtener Usuario Actual

**Descripción**: Devuelve la información del usuario autenticado.

- **URL**: `/api/v1/auth/user`
- **Método**: `GET`
- **Autenticación**: `Bearer Token` ✅

#### 📩 Request

**Headers**
```http
Authorization: Bearer <token>
```

#### 📤 Response

**✅ Success (200 OK)**

```json
{
  "id": 1,
  "username": "ProGamer",
  "email": "player@tierone.com",
  "rol": "player",
  "balance_disponible": 150.50,
  "verificado": true,
  "created_at": "2026-01-15T10:00:00Z"
}
```

**❌ Errors**

| Código | Descripción |
|:------:|-------------|
| `401` | Unauthenticated (Token inválido o expirado) |

---

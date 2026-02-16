# 📊 Diagramas de Flujo - TierOne

Esta carpeta contiene diagramas de flujo en formato Mermaid que visualizan los principales procesos y workflows del proyecto TierOne.

---

## 📑 Índice de Diagramas

### 🛒 E-commerce

#### [DF-Admin-Ecommerce.md](DF-Admin-Ecommerce.md)
Diagrama de flujo completo del **panel de administración del e-commerce**.

**Incluye:**
- 👕 Gestión de productos (crear, editar, variantes, stock)
- 📦 Gestión de órdenes (estados, cancelaciones, reembolsos)
- 👥 Gestión de clientes (perfiles, historiales)  
- 🏭 Gestión de proveedores (dropshipping, sincronización)
- 🔔 Sistema de notificaciones
- ⚙️ Configuración

---

### 🏆 Torneos

#### [DF-Admin-Torneos.md](DF-Admin-Torneos.md)
Diagrama de flujo del **panel de administración de torneos**.

**Incluye:**
- 🎮 Gestión de juegos
- 🏆 Gestión de torneos (crear, configurar, brackets)
- 👥 Gestión de inscripciones
- 🎯 Gestión de partidas
- 💰 Distribución de premios
- 📊 Reportes y moderación

---

### 💳 Pagos

#### [DF-Pagos-Stripe.md](DF-Pagos-Stripe.md)
Diagrama del **sistema de pagos con Stripe**.

**Incluye:**
- 💰 Depósitos de usuarios
- 🏆 Pagos de premios de torneos
- 🛒 Pagos de órdenes de e-commerce
- 💸 Retiros de usuarios
- 🔄 Webhooks de Stripe
- 📋 Registro de transacciones

---

### 🔀 Git Workflow

#### [Feature-Branch-Workflow.md](Feature-Branch-Workflow.md)
Documentación del **workflow de ramas** del proyecto.

**Incluye:**
- 🌳 Estrategia de branching
- 📝 Convenciones de nombres
- 🔄 Flujo de trabajo (feature → develop → main)
- ✅ Pull requests y code reviews
- 🏷️ Versionado y releases

---

## 🎨 Características de los Diagramas

- ✅ **Formato Mermaid** - Renderizables en GitHub, VS Code, y navegadores
- ✅ **Interactivos** - Navegación visual clara
- ✅ **Coloreados** - Códigos de color por módulo
- ✅ **Completos** - Cubren todos los flujos principales

---

## 📖 Cómo Visualizar

### En GitHub
Los diagramas se renderizan automáticamente en archivos `.md` en GitHub.

### En VS Code
Instala la extensión **Markdown Preview Mermaid Support**:
```bash
code --install-extension bierner.markdown-mermaid
```

### En Navegador
Usa [Mermaid Live Editor](https://mermaid.live/) para editar y visualizar.

---

**Última actualización:** Enero 2026  
**Versión:** 1.0

# 💼 Lógica de Negocio y Flujos

Este documento describe el funcionamiento interno de los tres pilares fundamentales de **TierOne**.

---

## 🛒 1. Sistema de E-commerce
El flujo de compra está diseñado para ser seguro y totalmente automatizado.

### Flujo de Compra:
1. **Selección**: El usuario añade productos (estándar o personalizados) al carrito.
2. **Checkout**: Se inicia una sesión de pago con **Stripe**.
3. **Validación**: Tras el pago exitoso, el sistema recibe un webhook.
4. **Post-Venta**: 
   - Se crea el registro del pedido en la BD.
   - Se genera una factura fiscal en PDF.
   - Se reduce el stock de los productos.

---

## 🏆 2. Gestión de Torneos
El sistema permite la creación y seguimiento de competiciones profesionales.

### Ciclo de Vida de un Torneo:
1. **Configuración**: El admin define el juego, premios y formato (Single Elimination/Round Robin).
2. **Inscripción**: Los usuarios se apuntan usando sus tokens o de forma gratuita.
3. **Ejecución**: El sistema genera los brackets automáticamente.
4. **Finalización**: Se validan los resultados y se reparten los premios a las carteras de los ganadores.

---

## 🎨 3. Personalizador de Productos
Es la herramienta estrella que permite a los usuarios crear merchandising único.

### Tecnología y Lógica:
- **Lienzo (Canvas)**: Basado en **Fabric.js**. Permite subir imágenes, añadir texto y rotar elementos.
- **Persistencia**: El diseño se guarda como un objeto JSON en la base de datos y se renderiza una previsualización (DataURL) para el carrito.
- **Integración**: Al comprar un producto personalizado, el operario recibe el JSON original para la impresión física.

---

## 💰 4. Moneda Virtual (Hydra Coins)
Sistema de fidelización y economía interna.
---

## 📊 Diagramas de Flujo (Visualización)
Para una comprensión visual de estos procesos, consulta:
- [🛒 **Flujo E-commerce**](../diagrams/DF-Admin-Ecommerce.md)
- [🏆 **Flujo Torneos**](../diagrams/DF-Admin-Torneos.md)
- [💳 **Flujo Pagos Stripe**](../diagrams/DF-Pagos-Stripe.md)

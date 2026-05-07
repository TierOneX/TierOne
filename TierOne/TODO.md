# TierOne - TODO List

## ✅ Completado (Sesión Actual)
- [x] **Estabilización de Coordenadas**: Solucionado el desplazamiento (drift) entre Admin y Cliente.
- [x] **Arquitectura Bunker**: Implementada imagen de fondo real (`<img>`) tras canvas transparente para evitar errores de renderizado de Fabric.js.
- [x] **Sincronización de Escalas**: Uso de `canvas_width` persistente en BD para cálculos proporcionales exactos.
- [x] **Exportación Completa**: Solucionado el problema del PNG vacío en el carrito; ahora incluye el producto completo.
- [x] **UX Premium**: Implementado `ConfirmationModal` estilizado para el proceso de compra.
- [x] **Gestión de Capas**: Conectado el panel lateral con las acciones de borrar/seleccionar en el lienzo.

## 🚀 Próximos Pasos
- [ ] Optimizar carga de fuentes pesadas en el editor.
- [ ] Implementar sistema de "Snap to grid" opcional para las zonas.
- [ ] Revisar rendimiento de `toDataURL` en dispositivos móviles de gama baja.

## 🐛 Bugs Conocidos (Trackeados)
- [ ] El scroll horizontal en móviles a veces interfiere con el arrastre de elementos (Touch events).

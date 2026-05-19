# 📋 Matriz de Trazabilidad del Pliego

Este documento es el eje principal de auditoría para garantizar que la totalidad de los requisitos estructurales exigidos en el pliego funcional original del cliente han sido diseñados, implementados y validados dentro del ecosistema tecnológico.

| ID Requisito | Descripción Funcional (Según Pliego) | Componente/Módulo Técnico Implementado | Estado Actual | Método de Validación (Prueba) | Evidencia Documental de Respaldo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-001** | Plataforma de E-commerce B2C completa, dotada de carrito de compras unificado. | `OrderService`, Endpoints REST (`ProductApi`), UI `CartContext` | ✅ Implementado | Pruebas Automáticas de Backend | Suite: `OrderApiTest.php` |
| **REQ-002** | Editor interactivo que permita a los usuarios previsualizar logos y textos en equipaciones base. | `CanvasEditor.jsx`, Integración Core de la librería Fabric.js | ✅ Implementado | Ejecución UAT Manual (Equipo Cliente) | Acta UAT de Diseño 15/05 |
| **REQ-003** | Registro e Inicio de sesión centralizado y único usando credenciales de Twitch. | Capa de `TwitchAuthService` e intercambio de tokens OAuth | ✅ Implementado | Validaciones de API Segura | Endpoint vivo en `/api/auth/twitch` |
| **REQ-004** | Ecosistema de Moneda virtual nativa (Hydra Coins) paralela al Euro convencional. | `WalletService`, Sistema de Modelos Eloquent (`HydraCoin`) | ✅ Implementado | Simulación transaccional | Historial estructurado en DB |
| **REQ-005** | Pasarela de transacciones mediante Tarjeta Bancaria garantizando seguridad transaccional. | Módulo `HydraCheckout`, API Segura de Stripe (Payment Intents) | ✅ Implementado | Emulación de Pago por Webhooks | Logs Dashboard de Stripe |
| **REQ-006** | Generación en tiempo real de facturas legales en formato PDF al liquidar pedidos. | `InvoiceService`, Librería de Renders `DOMPDF` | ✅ Implementado | Pruebas Unitarias Aisladas | Suite: `InvoiceServiceTest.php` |
| **REQ-007** | Consola administrativa CMS (Backoffice) exclusiva para staff y gestores. | Frontend Administrativo segregado en React JS + Vite | ✅ Implementado | Pase a Producción / Demo real | URL de `/admin` securizada |
| **REQ-008** | Lógica organizativa de Torneos, inscripción de jugadores y cruces. | Módulo `TournamentService`, Rutas protegidas de API | ✅ Implementado | Validaciones Feature de Endpoints | Suite: `TournamentApiTest.php` |

---
[🔙 Volver al Hub](../00_HUB.md) | *Gestión de Proyecto - TierOne*

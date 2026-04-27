# Documentación: Módulo de Facturas en PDF

Este documento detalla técnicamente el flujo de trabajo, las herramientas y la arquitectura implementada para la generación automatizada de facturas (Invoices) en la plataforma TierOne.

---

## 1. El Motor (Librería DOMPDF)
Para la traducción de los datos base a un formato imprimible y empaquetado, optamos por **`barryvdh/laravel-dompdf`**. 
Existen dos enfoques en el ecosistema al generar PDFs: navegadores headless (Spatie PDF con Puppeteer/Chrome) o parseadores en línea. Elegimos DomPdf (Parseador nativo de PHP) debido a su excelente seguridad en entornos virtualizados o locales en Windows, requiriendo nulas dependencias binarias y previniendo caídas en producción. 

*(Nota de Instalación: Durante la carga de la librería en Composer, si dependencias de APIs anexas como Stripe sufren un downgrade implícito, el sistema de CI del equipo debe asegurarse de lanzar un recálculo mediante `composer update stripe/stripe-php` para prevenir apagones de la pasarela de pagos).*

---

## 2. El Cerebro (`InvoiceService.php`)
Ubicado en `app/Services/InvoiceService.php`, este servicio centraliza y abstrae toda la lógica de ensamblaje documental. Cumple con la Arquitectura por Capas al no depender de Requests HTTP.

### Flujo del Servicio:
1. **Validación de la Entidad:** Recibe como único argumento de inicio el modelo de Eloquent (`Orden $orden`).
2. **Carga Inteligente de Relaciones:** Utilizar `$orden->loadMissing()` para agrupar los datos del usuario cliente, los objetos del carrito iterado y las direcciones de envío conectadas, previniendo cuellos de botella en la base de datos por el problema "N+1 Query".
3. **Procesamiento de Imágenes:** El logo de la empresa se convierte a **Base64** dentro del servicio (`public_path('images/Logo.png')`) antes de pasarlo a la vista. Esto es una técnica de robustez para evitar que DomPDF falle al intentar acceder al sistema de archivos local o a rutas relativas protegidas por el chroot.
4. **Selector de Salida (Output):** La lógica del servicio contempla tres tipos de compilación a través del parámetro `string $action`:
   - `download`: Forzará una descarga silenciosa de formato binario directamente al cliente.
   - `stream`: Carga la cabecera del documento para emular una previsualización incrustada nativa del navegador.
   - `save`: Retendrá un blob en la memoria y usará el driver de `Storage` para guardarlo silenciosamente en una carpeta `/invoices` (ideal si a futuro se empaqueta en correos electrónicos asíncronos o Mailschedules).

---

## 3. La Cara Visual (`invoice.blade.php`)
Ubicado en `resources/views/pdf/invoice.blade.php`.
Debido a la naturaleza de DomPdf, el motor de parseo requiere HTML plano y reglas CSS arcaicas integradas dentro de una etiqueta `<style>`. Las tecnologías CSS modernas como Flexbox, Grid o el uso externo de frameworks de JS interfieren con su renderizado.

### Composición del Diseño:
Se maquetó una estructura segura en forma de tablas jerárquicas:
- **Cabecera (`.header`)**: Exhibe simétricamente los datos del emisor contrastados contra el sello o el string identificador "FACTURA COMERCIAL".
- **Bloque de Facturación (`.billing-info`)**: Detecta condicionalmente en Blade si el usuario capturó una dirección de envío (`->direccionEnvio`) o imprime a su defecto la identidad base del usuario. Contiene el *Badge* de Estado.
- **Detalles (`.items-table` y `.totals-table`)**: Un *foreach* que inyecta cada `ItemOrden`. Las matemáticas de impuestos, descuentos y tarifas aduaneras (costo de envíos) se presentan flotadas a la derecha con un cierre en `TOTAL FINAL`. Se apoya internamente en `number_format()` para forzar los 2 decimales para la moneda Europea.

---

## 4. El Puente o Endpoint de Petición
Para brindar utilidad externa a este sistema, la interfaz fue asegurada a un Controlador del ámbito Web (evitando chocar con el ámbito JSON de la API).

- **Clase Involucrada:** `App\Http\Controllers\Web\OrderController`
- **Inyección de Dependencia:** El constructor absorbe ahora `InvoiceService $invoiceService` manteniendo su declaración como `protected`.
- **Ruta Habilitada:** `GET /panel-admin-ecommerce/orders/{orden}/invoice`
  
Cualquier petición web directa a esta ruta (por ejemplo insertando un botón `<a>` target="_blank" en el Action Column de un datatable de Inertia) desencadenará exitosamente el ensamblaje de todos estos estratos.

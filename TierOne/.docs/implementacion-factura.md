Entonces vamos a hacer una factura premium estilo TierOne:

🖤 Fondo negro

🔴 Rojo #dc143c como color principal

Tipografía moderna

Estética streetwear gaming

Profesional y válida fiscalmente

Te dejo el plan final listo para implementar en producción.

🏗 ARQUITECTURA FINAL
React → Laravel API → MySQL
                     ↓
             Generación PDF (DomPDF)
                     ↓
           Storage privado (no público)

🔧 BACKEND – Implementación paso a paso
1️⃣ Instalar DomPDF
composer require barryvdh/laravel-dompdf

2️⃣ Crear estructura de factura
Tabla invoices
id
user_id
type (shop | tournament)
reference_id
invoice_number
subtotal
tax
discount
total
status
pdf_path
created_at

3️⃣ Generador de número de factura

Ejemplo profesional:

T1-2026-000045


En Laravel:

private function generateInvoiceNumber()
{
    $lastInvoice = Invoice::latest()->first();
    $number = $lastInvoice ? $lastInvoice->id + 1 : 1;

    return 'T1-'.date('Y').'-'.str_pad($number, 6, '0', STR_PAD_LEFT);
}

🎮 4️⃣ Generación del PDF Estilo Gaming

⚠️ Importante: DomPDF no soporta bien fondos negros globales, así que lo haremos correctamente.

🎨 HTML optimizado para DomPDF
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

public function generatePdf($invoice)
{
    $user = $invoice->user;

    $html = "
    <html>
    <head>
        <style>
            body {
                font-family: DejaVu Sans, sans-serif;
                background-color: #000000;
                color: #ffffff;
                padding: 40px;
            }

            .container {
                background-color: #111111;
                padding: 30px;
                border-radius: 8px;
            }

            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #dc143c;
                margin-bottom: 20px;
            }

            .divider {
                border-bottom: 2px solid #dc143c;
                margin: 15px 0;
            }

            .total {
                font-size: 20px;
                font-weight: bold;
                color: #dc143c;
            }

            table {
                width: 100%;
                margin-top: 20px;
                border-collapse: collapse;
            }

            td {
                padding: 8px 0;
            }

            .right {
                text-align: right;
            }
        </style>
    </head>
    <body>

        <div class='container'>

            <div class='logo'>TIERONE</div>

            <div>Factura Nº: {$invoice->invoice_number}</div>
            <div>Fecha: ".date('d/m/Y')."</div>

            <div class='divider'></div>

            <div>
                <strong>Cliente:</strong> {$user->name}<br>
                <strong>Email:</strong> {$user->email}
            </div>

            <div class='divider'></div>

            <table>
                <tr>
                    <td>Subtotal</td>
                    <td class='right'>{$invoice->subtotal}€</td>
                </tr>
                <tr>
                    <td>IVA (21%)</td>
                    <td class='right'>{$invoice->tax}€</td>
                </tr>
                <tr>
                    <td>Descuento competitivo</td>
                    <td class='right'>-{$invoice->discount}€</td>
                </tr>
                <tr>
                    <td class='total'>TOTAL</td>
                    <td class='right total'>{$invoice->total}€</td>
                </tr>
            </table>

            <div class='divider'></div>

            <div style='font-size:12px; color:#888; margin-top:20px;'>
                TierOne Gaming SL<br>
                Integridad • Fair Play • Premium Quality<br>
                Play Hard. Win Bigger.
            </div>

        </div>

    </body>
    </html>
    ";

    $pdf = Pdf::loadHTML($html)->setPaper('a4');
    $path = "invoices/{$invoice->invoice_number}.pdf";

    Storage::put($path, $pdf->output());

    $invoice->update(['pdf_path' => $path]);
}

🛡 Seguridad (MUY importante)

En el endpoint de descarga:

public function download($id)
{
    $invoice = Invoice::where('id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    return Storage::download($invoice->pdf_path);
}


✔️ Evita que un usuario descargue facturas de otro
✔️ Storage privado

🎮 FRONTEND – React
Endpoint
GET /api/invoices
GET /api/invoices/{id}/download

Botón descargar en React
const downloadInvoice = async (id) => {
  const response = await fetch(`/api/invoices/${id}/download`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tierone-invoice.pdf";
  a.click();
};

🔥 Mejora PRO (Recomendado para TierOne)

Puedes añadir:

🔴 Barra roja lateral tipo gaming

🎮 ID del torneo o producto

🏆 "Tournament Victory Discount Applied"

🔐 Código QR de validación

🖋 Firma digital de la empresa

🧠 Flujo final profesional
Pago confirmado →
Laravel crea invoice →
Genera PDF oscuro premium →
Guarda en storage →
React muestra en perfil →
Usuario descarga →
Email automático con PDF adjunto




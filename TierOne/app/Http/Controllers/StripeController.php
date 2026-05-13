<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\ItemCarrito;
use App\Models\ItemOrden;
use App\Models\Pago;
use App\Models\Producto;
use App\Models\VarianteProducto;
use App\Models\Orden;
use App\Models\InscripcionTorneo;
use App\Models\Torneo;
use App\Services\InvoiceService;
use App\Services\CustomizationService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeController extends Controller
{
    use ApiResponseTrait;

    private StripeClient $stripe;

    public function __construct(
        protected CustomizationService $customizationService
    ) {
        $this->stripe = new StripeClient(config('stripe.secret'));
    }

    // =========================================================================
    // 1. CREAR PAYMENT INTENT
    // =========================================================================
    /**
     * Crea un PaymentIntent en Stripe y una Orden pendiente en la BD.
     *
     * Recibe del frontend:
     *   - items: array de { id, cantidad, id_variante? }
     *   - id_direccion_envio (opcional, nullable por ahora)
     *
     * Devuelve:
     *   - client_secret  → para confirmar el pago en el frontend
     *   - order_id       → ID de la orden creada en BD
     *   - total          → total en EUR
     */
    public function crearPaymentIntent(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array|min:1',
                'items.*.id' => 'required|exists:productos,id',
                'items.*.cantidad' => 'required|integer|min:1',
                'items.*.id_variante' => 'nullable|exists:variantes_productos,id',
                'items.*.personalizacion_data' => 'nullable|array',
                'id_direccion_envio' => 'nullable|exists:direcciones_envio,id',
            ]);

            // --- Calcular montos desde la BD (nunca fiarnos del frontend) ---
            $subtotal = 0;
            $itemsData = [];

            foreach ($validated['items'] as $itemReq) {
                $producto = Producto::findOrFail($itemReq['id']);

                // Si hay variante, usar su precio si difiere
                $precio = $producto->precio_venta;
                if (!empty($itemReq['id_variante'])) {
                    $variante = VarianteProducto::find($itemReq['id_variante']);
                    // VarianteProducto usa el campo 'precio' (no 'precio_venta')
                    if ($variante && $variante->precio) {
                        $precio = $variante->precio;
                    }
                }

                $recargo = 0;
                if (!empty($itemReq['personalizacion_data'])) {
                    // Validar recargo en el backend para seguridad
                    $resRecargo = $this->customizationService->calcularRecargo($itemReq['personalizacion_data']['zonas'] ?? [], $producto->id);
                    $recargo = $resRecargo['total'];
                }

                $lineSubtotal = round(($precio + $recargo) * $itemReq['cantidad'], 2);
                $subtotal += $lineSubtotal;

                $itemsData[] = [
                    'id_producto' => $producto->id,
                    'id_variante' => $itemReq['id_variante'] ?? null,
                    'nombre' => $producto->nombre,
                    'cantidad' => $itemReq['cantidad'],
                    'precio_unitario' => $precio + $recargo,
                    'subtotal' => $lineSubtotal,
                    'personalizacion_data' => $itemReq['personalizacion_data'] ?? null,
                ];
            }

            $taxRate = 0.21;
            $impuestos = round($subtotal * $taxRate, 2);
            $costoEnvio = 0.00;
            $descuento = 0.00;
            $total = round($subtotal + $impuestos + $costoEnvio - $descuento, 2);

            // Stripe trabaja en centimos (integer)
            $amountCents = (int)round($total * 100);

            // --- Crear todo en una transacción DB atómica ---
            $result = DB::transaction(function () use ($validated, $itemsData, $subtotal, $impuestos, $costoEnvio, $descuento, $total, $amountCents) {

                // 1. Crear la Orden en estado 'pendiente'
                $numeroOrden = 'TIO-' . strtoupper(uniqid());

                $orden = Orden::create([
                    'id_usuario' => Auth::id() ?? 1, // fallback a 1 si no hay auth (test)
                    'id_direccion_envio' => $validated['id_direccion_envio'] ?? 1,
                    'numero_orden' => $numeroOrden,
                    'subtotal' => $subtotal,
                    'impuestos' => $impuestos,
                    'costo_envio' => $costoEnvio,
                    'descuento' => $descuento,
                    'total' => $total,
                    'estado' => 'pendiente',
                    'fecha_orden' => now(),
                ]);

                // 2. Crear los ItemOrden
                foreach ($itemsData as $item) {
                    // Obtener el id_proveedor real del producto
                    $productoOriginal = Producto::find($item['id_producto']);

                    ItemOrden::create([
                        'id_orden' => $orden->id,
                        'id_producto' => $item['id_producto'],
                        'id_variante' => $item['id_variante'],
                        'id_proveedor' => $productoOriginal->id_proveedor ?? 1,
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio_unitario'],
                        'subtotal' => $item['subtotal'],
                        'personalizacion_data' => $item['personalizacion_data'] ?? null,
                        'personalizacion_imagen' => isset($item['personalizacion_data']['render_principal']) 
                            ? $this->customizationService->saveRenderedDesign($item['personalizacion_data']['render_principal'], $item['id_producto'])
                            : null,
                    ]);
                }

                // 3. Crear PaymentIntent en Stripe
                $paymentIntent = $this->stripe->paymentIntents->create([
                    'amount' => $amountCents,
                    'currency' => config('stripe.currency', 'eur'),
                    'automatic_payment_methods' => ['enabled' => true],
                    'metadata' => [
                        'orden_id' => $orden->id,
                        'numero_orden' => $orden->numero_orden,
                        'user_id' => Auth::id() ?? 1,
                    ],
                    'description' => "Pedido TierOne #{$orden->numero_orden}",
                ]);

                // 4. Guardar el PI id en la orden
                $orden->update(['stripe_payment_intent_id' => $paymentIntent->id]);

                // 5. Crear el registro de Pago (pendiente)
                Pago::create([
                    'id_orden' => $orden->id,
                    'monto' => $total,
                    'metodo' => 'tarjeta',
                    'id_transaccion' => $paymentIntent->id,
                    'estado' => 'pendiente',
                    'fecha_pago' => now(),
                    'detalles_json' => [
                        'payment_intent_id' => $paymentIntent->id,
                        'amount_cents' => $amountCents,
                        'currency' => config('stripe.currency', 'eur'),
                        'status' => $paymentIntent->status,
                    ],
                ]);

                return [
                'client_secret' => $paymentIntent->client_secret,
                'order_id' => $orden->id,
                'numero_orden' => $orden->numero_orden,
                'total' => $total,
                'subtotal' => $subtotal,
                'impuestos' => $impuestos,
                ];
            });

            return $this->successResponse($result, 'PaymentIntent creado correctamente', 201);

        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        }
        catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('Stripe API Error: ' . $e->getMessage());
            return $this->errorResponse('Error al conectar con Stripe', $e->getMessage(), 502);
        }
        catch (\Exception $e) {
            Log::error('Error en crearPaymentIntent: ' . $e->getMessage());
            return $this->errorResponse('Error al procesar el pago', $e->getMessage(), 500);
        }
    }

    /**
     * Crea un PaymentIntent para la inscripción a un torneo.
     * Sigue el 'modelo de tienda' personalizado.
     */
    public function crearPaymentIntentTorneo(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_torneo' => 'required|exists:torneos,id',
            ]);

            $torneo = Torneo::with('juego')->findOrFail($validated['id_torneo']);
            $user = Auth::user();
            $total = (float) $torneo->cuota_inscripcion;
            $taxRate = 0.21;
            $subtotal = round($total / (1 + $taxRate), 2);
            $impuestos = round($total - $subtotal, 2);

            if ($total <= 0) {
                return $this->errorResponse('Este torneo no requiere pago.', null, 400);
            }

            $amountCents = (int)round($total * 100);

            $result = DB::transaction(function () use ($torneo, $user, $total, $subtotal, $impuestos, $amountCents) {
                // 1. Crear Orden pendiente
                $numeroOrden = 'TRN-' . strtoupper(uniqid());
                
                $direccion = \App\Models\DireccionEnvio::where('id_usuario', $user->id)
                    ->orderBy('predeterminada', 'desc')
                    ->first();

                $orden = Orden::create([
                    'id_usuario' => $user->id,
                    'id_direccion_envio' => $direccion->id ?? 1, // Fallback to 1 ONLY if no address exists
                    'numero_orden' => $numeroOrden,
                    'subtotal' => $subtotal,
                    'impuestos' => $impuestos,
                    'costo_envio' => 0,
                    'descuento' => 0,
                    'total' => $total,
                    'estado' => 'pendiente',
                    'fecha_orden' => now(),
                ]);

                // 2. Crear ItemOrden
                ItemOrden::create([
                    'id_orden' => $orden->id,
                    'id_producto' => 1, // Placeholder
                    'id_proveedor' => 1, // Placeholder
                    'cantidad' => 1,
                    'precio_unitario' => $subtotal,
                    'subtotal' => $subtotal,
                ]);

                // 3. Crear PaymentIntent
                $paymentIntent = $this->stripe->paymentIntents->create([
                    'amount' => $amountCents,
                    'currency' => config('stripe.currency', 'eur'),
                    'automatic_payment_methods' => ['enabled' => true],
                    'metadata' => [
                        'type' => 'tournament_registration',
                        'orden_id' => $orden->id,
                        'torneo_id' => $torneo->id,
                        'user_id' => $user->id,
                    ],
                    'description' => "Inscripción Torneo #{$torneo->id} - {$torneo->nombre}",
                ]);

                $orden->update(['stripe_payment_intent_id' => $paymentIntent->id]);

                // 4. Crear registro de Pago
                Pago::create([
                    'id_orden' => $orden->id,
                    'monto' => $total,
                    'metodo' => 'tarjeta',
                    'id_transaccion' => $paymentIntent->id,
                    'estado' => 'pendiente',
                    'fecha_pago' => now(),
                    'detalles_json' => ['payment_intent_id' => $paymentIntent->id],
                ]);

                return [
                    'client_secret' => $paymentIntent->client_secret,
                    'order_id' => $orden->id,
                    'numero_orden' => $orden->numero_orden,
                    'total' => $total,
                ];
            });

            return $this->successResponse($result, 'Intent de torneo creado');

        } catch (\Exception $e) {
            Log::error('Error en crearPaymentIntentTorneo: ' . $e->getMessage());
            return $this->errorResponse('Error al procesar el pago del torneo', $e->getMessage(), 500);
        }
    }

    // =========================================================================
    // 2. WEBHOOK — Stripe notifica el resultado del pago
    // =========================================================================
    /**
     * Recibe y verifica los webhooks de Stripe.
     * Ruta: POST /stripe/webhook (sin CSRF, excluida en VerifyCsrfToken)
     *
     * Eventos manejados:
     *   - payment_intent.succeeded   → marcar orden como 'pagada'
     *   - payment_intent.payment_failed → marcar orden como 'cancelada'
     */
    public function webhook(Request $request): \Illuminate\Http\Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        }
        catch (\UnexpectedValueException $e) {
            Log::warning('Stripe Webhook: payload inválido');
            return response('Payload inválido', 400);
        }
        catch (SignatureVerificationException $e) {
            Log::warning('Stripe Webhook: firma inválida');
            return response('Firma inválida', 400);
        }

        // Manejar el evento
        switch ($event->type) {

            case 'payment_intent.succeeded':
                $this->handlePaymentIntentSucceeded($event->data->object);
                break;

            case 'payment_intent.payment_failed':
                $this->handlePaymentIntentFailed($event->data->object);
                break;
            
            case 'checkout.session.completed':
                $this->handleCheckoutSessionCompleted($event->data->object);
                break;

            default:
                Log::info("Stripe Webhook: evento no manejado [{$event->type}]");
                break;
        }

        return response('OK', 200);
    }

    // =========================================================================
    // 3. CONFIRMAR PAGO DIRECTAMENTE (sin webhook — válido para desarrollo)
    // =========================================================================
    /**
     * El frontend llama a este endpoint justo después de que Stripe confirma el pago.
     * Se consulta a la API de Stripe para verificar el estado real del PaymentIntent
     * y se actualiza la BD de forma segura.
     *
     * Recibe:  { payment_intent_id: "pi_xxx" }
     * Devuelve: estado de la orden actualizado
     */
    public function confirmarPago(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'payment_intent_id' => 'required|string',
            ]);

            $piId = $validated['payment_intent_id'];

            // 1. Verificar con Stripe que el PI realmente está pagado
            $paymentIntent = $this->stripe->paymentIntents->retrieve($piId);

            if ($paymentIntent->status !== 'succeeded') {
                return $this->errorResponse(
                    'El pago no se ha completado. Estado: ' . $paymentIntent->status,
                    null,
                    422
                );
            }

            // 2. Buscar la orden por el PI id
            $orden = Orden::where('stripe_payment_intent_id', $piId)->first();

            if (!$orden) {
                return $this->notFoundResponse('Orden no encontrada para este pago.');
            }

            // 3. Procesar el éxito
            if (isset($paymentIntent->metadata->type) && $paymentIntent->metadata->type === 'tournament_registration') {
                $this->procesarExitoTorneo($paymentIntent, $paymentIntent->metadata);
            } else {
                $this->procesarExitoOrden($orden, $paymentIntent);
            }

            Log::info("Orden #{$orden->numero_orden} confirmada directamente (sin webhook).");

            return $this->successResponse([
                'order_id' => $orden->id,
                'numero_orden' => $orden->numero_orden,
                'estado' => 'pagada',
            ], 'Pago confirmado correctamente');

        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        }
        catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('Stripe confirmarPago API Error: ' . $e->getMessage());
            return $this->errorResponse('Error al verificar el pago con Stripe', $e->getMessage(), 502);
        }
        catch (\Exception $e) {
            Log::error('Error en confirmarPago: ' . $e->getMessage());
            return $this->errorResponse('Error al confirmar el pago', $e->getMessage(), 500);
        }
    }

    // =========================================================================
    // 4. OBTENER ESTADO DE UNA ORDEN (para la página de confirmación)
    // =========================================================================
    /**
     * Devuelve el estado y detalles de la orden para la página de éxito.
     */
    public function obtenerOrden(string $orderId): JsonResponse
    {
        try {
            $orden = Orden::with(['items.producto', 'pagos'])->findOrFail($orderId);
            return $this->successResponse($orden, 'Orden obtenida correctamente');
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Orden no encontrada');
        }
        catch (\Exception $e) {
            return $this->errorResponse('Error al obtener la orden', $e->getMessage());
        }
    }

    // =========================================================================
    // HANDLERS PRIVADOS
    // =========================================================================

    private function handlePaymentIntentSucceeded(object $paymentIntent): void
    {
        $orden = Orden::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if (!$orden) {
            Log::error("Webhook succeeded: Orden no encontrada para PI {$paymentIntent->id}");
            return;
        }

        $this->procesarExitoOrden($orden, $paymentIntent);

        Log::info("Orden #{$orden->numero_orden} marcada como PAGADA.");
    }

    private function procesarExitoOrden(Orden $orden, object $paymentIntent): void
    {
        // Evitar procesar dos veces si ya está pagada
        if ($orden->estado === 'pagada')
            return;

        DB::transaction(function () use ($orden, $paymentIntent) {
            // 1. Actualizar Orden
            $orden->update(['estado' => 'pagada']);

            // 2. Actualizar Pago asociado
            $pago = Pago::where('id_transaccion', $paymentIntent->id)->first();
            if ($pago) {
                $pago->update([
                    'estado' => 'completado',
                    'detalles_json' => array_merge($pago->detalles_json ?? [], [
                        'status' => 'succeeded',
                        'payment_method' => $paymentIntent->payment_method ?? null,
                        'confirmed_at' => now()->toISOString(),
                    ]),
                ]);
            }

            // 3. Incrementar ventas totales de los productos
            $items = ItemOrden::where('id_orden', $orden->id)->get();
            foreach ($items as $item) {
                $producto = Producto::find($item->id_producto);
                if ($producto) {
                    $producto->increment('ventas_totales', $item->cantidad);
                }
            }

            // 4. Limpiar el carrito en la base de datos para este usuario
            if ($orden->id_usuario) {
                $carrito = Carrito::where('id_usuario', $orden->id_usuario)->first();
                if ($carrito) {
                    // Eliminar todos los items del carrito
                    ItemCarrito::where('id_carrito', $carrito->id)->delete();
                    // Reiniciar el subtotal del carrito
                    $carrito->update(['subtotal' => 0]);
                }
            }
        });

        Log::info("Orden #{$orden->numero_orden} procesada con éxito. Ventas incrementadas.");
    }

    private function handlePaymentIntentFailed(object $paymentIntent): void
    {
        $orden = Orden::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if (!$orden) {
            Log::error("Webhook failed: Orden no encontrada para PI {$paymentIntent->id}");
            return;
        }

        DB::transaction(function () use ($orden, $paymentIntent) {
            $orden->update([
                'estado' => 'cancelada',
                'razon_cancelacion' => $paymentIntent->last_payment_error->message ?? 'Pago fallido',
                'fecha_cancelacion' => now(),
            ]);

            $pago = Pago::where('id_transaccion', $paymentIntent->id)->first();
            if ($pago) {
                $pago->update(['estado' => 'fallido']);
            }
        });

        Log::info("Orden #{$orden->numero_orden} marcada como CANCELADA por fallo de pago.");
    }

    private function handleCheckoutSessionCompleted(object $session): void
    {
        $metadata = $session->metadata;

        if (isset($metadata->type) && $metadata->type === 'tournament_registration') {
            $this->procesarExitoTorneo($session, $metadata);
        }
    }

    private function procesarExitoTorneo(object $session, object $metadata): void
    {
        $torneoId = $metadata->torneo_id;
        $userId = $metadata->user_id;

        $inscripcion = InscripcionTorneo::where('id_torneo', $torneoId)
            ->where('id_usuario', $userId)
            ->where('estado', 'pendiente')
            ->first();

        if (!$inscripcion) {
            Log::error("Webhook: Inscripcion no encontrada para Torneo {$torneoId} y Usuario {$userId}");
            return;
        }

        DB::transaction(function () use ($inscripcion, $session, $torneoId, $userId) {
            // 1. Confirmar inscripción
            $inscripcion->update(['estado' => 'confirmada']);

            // 2. Crear Orden para la factura
            $torneo = Torneo::find($torneoId);
            $numeroOrden = 'TRN-' . strtoupper(uniqid());
            
            $total = (float) $inscripcion->pago_cuota;
            $taxRate = 0.21;
            $subtotal = round($total / (1 + $taxRate), 2);
            $impuestos = round($total - $subtotal, 2);

            $orden = Orden::create([
                'id_usuario' => $userId,
                'id_direccion_envio' => 1, // No aplica para digital (usamos placeholder)
                'numero_orden' => $numeroOrden,
                'subtotal' => $subtotal,
                'impuestos' => $impuestos,
                'costo_envio' => 0,
                'descuento' => 0,
                'total' => $total,
                'estado' => 'pagada',
                'fecha_orden' => now(),
                'stripe_payment_intent_id' => $session->payment_intent ?? $session->id,
            ]);

            // 3. Crear ItemOrden
            ItemOrden::create([
                'id_orden' => $orden->id,
                'id_producto' => 1, // Usar un ID genérico o crear uno para "Cuota Torneo"
                'id_variante' => null,
                'id_proveedor' => 1,
                'cantidad' => 1,
                'precio_unitario' => $subtotal,
                'subtotal' => $subtotal,
            ]);

            // 4. Crear Pago
            Pago::create([
                'id_orden' => $orden->id,
                'monto' => $inscripcion->pago_cuota,
                'metodo' => 'stripe_checkout',
                'id_transaccion' => $session->id,
                'estado' => 'completado',
                'fecha_pago' => now(),
            ]);
            
            Log::info("Factura generada para Torneo #{$torneoId} - Orden #{$numeroOrden}");
        });
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrdenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Cabecera de la orden
            'id_usuario' => 'required|exists:users,id',
            'id_direccion_envio' => 'required|exists:direcciones_envio,id',
            'numero_orden' => 'required|string|unique:ordenes,numero_orden',
            'subtotal' => 'required|numeric|min:0',
            'impuestos' => 'required|numeric|min:0',
            'costo_envio' => 'required|numeric|min:0',
            'descuento' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'estado' => 'required|in:pendiente,pagada,enviada_proveedor,en_transito,entregada,cancelada',
            'fecha_orden' => 'required|date',
            'tracking_number' => 'nullable|string',
            'transportista' => 'nullable|string',

            // Validación de array anidado: cada item de la orden
            // La notación items.* valida CADA elemento del array
            'items' => 'required|array|min:1',
            'items.*.id_producto' => 'required|exists:productos,id',
            'items.*.id_variante' => 'nullable|exists:variantes_productos,id',
            'items.*.id_proveedor' => 'required|exists:proveedores,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
        ];
    }
}

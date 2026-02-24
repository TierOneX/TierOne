<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrdenRequest extends FormRequest
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
            'estado' => 'sometimes|in:pendiente,pagada,enviada_proveedor,en_transito,entregada,cancelada',
            'tracking_number' => 'nullable|string',
            'transportista' => 'nullable|string',
            'fecha_enviada_proveedor' => 'nullable|date',
            'fecha_actualizacion' => 'nullable|date',
            'id_cancelado_por' => 'nullable|exists:users,id',
            'fecha_cancelacion' => 'nullable|date',
            'razon_cancelacion' => 'nullable|string',
        ];
    }
}

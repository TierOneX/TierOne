<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProveedorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('proveedore') ?? $this->route('proveedor') ?? $this->route('id'); // 'proveedore' es singular de proveedores en laravel a veces si no se define bien, cubrimos bases.

        return [
            'nombre' => 'sometimes|required|string|max:100',
            'contacto_nombre' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|max:100|unique:proveedores,email,' . $id,
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:500',
            'notas' => 'nullable|string',
            'activo' => 'nullable|boolean',
        ];
    }
}

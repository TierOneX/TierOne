<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProveedorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'contacto_nombre' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:proveedores,email',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:500',
            'notas' => 'nullable|string',
            'activo' => 'nullable|boolean',
        ];
    }
}

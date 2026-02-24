<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
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
            'id_categoria' => 'required|exists:categorias,id',
            'id_proveedor' => 'required|exists:proveedores,id',
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:productos,slug',
            'descripcion' => 'nullable|string',
            'precio_proveedor' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'imagen_principal' => 'nullable|string|max:255', // En futuro podría ser 'image' validación si se sube archivo
            'destacado' => 'nullable|boolean',
            'activo' => 'nullable|boolean',
        ];
    }
}

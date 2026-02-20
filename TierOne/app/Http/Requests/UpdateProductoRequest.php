<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductoRequest extends FormRequest
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
        // $this->route('id') obtiene el ID del recurso de la URL para excluirlo
        // en la validación de unicidad (evita falso error al guardar el mismo slug)
        $id = $this->route('id');

        return [
            'id_categoria' => 'sometimes|exists:categorias,id',
            'id_proveedor' => 'sometimes|exists:proveedores,id',
            'nombre' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:productos,slug,' . $id,
            'descripcion' => 'nullable|string',
            'precio_proveedor' => 'sometimes|numeric|min:0',
            'precio_venta' => 'sometimes|numeric|min:0',
            'imagen_principal' => 'nullable|string|max:255',
            'destacado' => 'nullable|boolean',
            'activo' => 'nullable|boolean',
        ];
    }
}

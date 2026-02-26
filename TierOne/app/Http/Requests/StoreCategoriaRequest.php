<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_parent' => 'nullable|integer|exists:categorias,id',
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categorias,slug',
            'descripcion' => 'nullable|string',
            'activa' => 'nullable|boolean',
        ];
    }
}

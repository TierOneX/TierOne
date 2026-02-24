<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJuegoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:juegos,slug',
            'descripcion' => 'nullable|string',
            'imagen_url' => 'nullable|url|max:255',
            'categoria' => 'required|string|max:50',
            'activo' => 'nullable|boolean',
        ];
    }
}

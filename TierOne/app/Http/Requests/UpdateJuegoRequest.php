<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJuegoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('juego') ?? $this->route('id');

        return [
            'nombre' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:juegos,slug,' . $id,
            'descripcion' => 'nullable|string',
            'imagen_url' => 'nullable|url|max:255',
            'categoria' => 'sometimes|required|string|max:50',
            'activo' => 'nullable|boolean',
        ];
    }
}

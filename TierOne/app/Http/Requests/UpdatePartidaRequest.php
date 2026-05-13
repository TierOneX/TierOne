<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartidaRequest extends FormRequest
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
            'id_juego' => 'sometimes|exists:juegos,id',
            'titulo' => 'sometimes|string|max:255',
            'estado' => 'sometimes|string',
            'fecha_fin' => 'nullable|date',
            'premio_total' => 'sometimes|numeric',
            'datos_api_json' => 'nullable|array',
        ];
    }
}

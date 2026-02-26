<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePartidaRequest extends FormRequest
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
            'id_juego' => 'required|exists:juegos,id',
            'id_creador' => 'required|exists:users,id',
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'buy_in' => 'required|numeric|min:0',
            'premio_total' => 'required|numeric|min:0',
            'comision_plataforma' => 'required|numeric|min:0',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after:fecha_inicio',
            'estado' => 'required|string',
            'origen' => 'required|string',
            'partida_api_id' => 'nullable|string',
            'datos_api_json' => 'nullable|array',
        ];
    }
}

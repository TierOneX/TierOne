<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTorneoRequest extends FormRequest
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
            'id_organizador' => 'required|exists:users,id',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen_banner' => 'required|string|max:255',
            'formato' => 'required|in:eliminacion_simple,doble_eliminacion,round_robin,swiss',
            'max_participantes' => 'required|integer|min:2',
            'cuota_inscripcion' => 'required|numeric|min:0',
            'premio_total' => 'required|numeric|min:0',
            'comision_plataforma_porcentaje' => 'required|numeric|min:0|max:100',
            'es_gratuito' => 'required|boolean',
            // Validación cruzada de fechas: fin debe ser después de inicio, y el
            // cierre de inscripciones debe ser antes de que el torneo comience
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'cierre_inscripciones' => 'required|date|before:fecha_inicio',
            'estado' => 'required|in:inscripciones,en_curso,finalizado,cancelado',
            'reglas_url' => 'required|url',
            'stream_url' => 'required|url',
            'verificado' => 'required|boolean',
        ];
    }
}

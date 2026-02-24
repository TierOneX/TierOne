<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTorneoRequest extends FormRequest
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
            'id_organizador' => 'sometimes|exists:users,id',
            'nombre' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'imagen_banner' => 'sometimes|string',
            'formato' => 'sometimes|in:eliminacion_simple,doble_eliminacion,round_robin,swiss',
            'max_participantes' => 'sometimes|integer|min:2',
            'cuota_inscripcion' => 'sometimes|numeric|min:0',
            'premio_total' => 'sometimes|numeric|min:0',
            'comision_plataforma_porcentaje' => 'sometimes|numeric|min:0|max:100',
            'es_gratuito' => 'sometimes|boolean',
            'fecha_inicio' => 'sometimes|date',
            'fecha_fin' => 'sometimes|date|after:fecha_inicio',
            'cierre_inscripciones' => 'sometimes|date|before:fecha_inicio',
            'estado' => 'sometimes|in:inscripciones,en_curso,finalizado,cancelado',
            'reglas_url' => 'sometimes|url',
            'stream_url' => 'sometimes|url',
            'verificado' => 'sometimes|boolean',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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
            'id_producto' => 'required|exists:productos,id',
            'id_usuario' => 'required|exists:users,id',
            'calificacion' => 'required|integer|min:1|max:5',
            'comentario' => 'required|string|max:1000',
            'verificado_compra' => 'boolean',
        ];
    }
}

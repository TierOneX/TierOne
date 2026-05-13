<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
        $userId = $this->route("user"); //? Captura la ID de la URL (ej: /user/S)
        return [
            'username' => 'sometimes|required|string|max:255|unique:users,username,' . $userId,
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $userId,
            'password_hash' => 'sometimes|required|string|min:8',
            'nombre' => 'sometimes|required|string|max:255',
            'apellido' => 'sometimes|required|string|max:255',
            'pais' => 'sometimes|required|string|max:100',
            'rol' => 'nullable|in:player,admin,streamer',
            'verificado' => 'nullable|boolean',
            'activo' => 'nullable|boolean',
        ];
    }
}

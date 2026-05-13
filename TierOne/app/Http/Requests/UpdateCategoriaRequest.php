<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('categoria');
        // Nota: asumiendo que el parametro de ruta se llama 'categoria' o el ID viene ahí.
        // Si el parametro es 'id', usar $this->route('id'). 
        // Veremos en el controller: show(string $id). Laravel resource routes suelen usar el nombre del modelo.
        // Pero en CategoriaController los metodos usan $id. 
        // Si la ruta es resource('categorias', ...), el parametro es {categoria}. 
        // Si es manual get('categorias/{id}'), es {id}.
        // Dado el uso de $id en el controller, asumire que podemos cogerlo de la ruta 'categoria' (standard resource) 
        // O intentaré coger el segmento. Para mayor seguridad usaré $this->route('id') ?? $this->route('categoria');

        // Revisando routes/api.php saldria de dudas, pero asumire 'categoria' (standard) o 'id'.
        // Pondre una logica robusta.

        $id = $this->route('categoria') ?? $this->route('id');

        return [
            'id_parent' => 'nullable|integer|exists:categorias,id',
            'nombre' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:categorias,slug,' . $id,
            'descripcion' => 'nullable|string',
            'activa' => 'nullable|boolean',
        ];
    }
}

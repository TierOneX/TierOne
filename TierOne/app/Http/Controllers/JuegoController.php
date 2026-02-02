<?php

namespace App\Http\Controllers;

use App\Models\Juego;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class JuegoController extends Controller
{
    use ApiResponseTrait;
    /**
     * Summary of index
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $juegos = Juego::all();
            return $this->successResponse($juegos, 'Juegos obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener los datos', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:juegos,slug',
                'descripcion' => 'nullable|string',
                'imagen_url' => 'nullable|url|max:255',
                'categoria' => 'required|string|max:50', 
                'activo' => 'nullable|boolean',
            ]);
            $juego = Juego::create($request->all());
            return $this->successResponse($juego, 'Juego ha sido creado correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->getMessage());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear juego', $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

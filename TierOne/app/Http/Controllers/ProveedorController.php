<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $proveedores = Proveedor::all();
            return $this->successResponse($proveedores, 'Proveedores obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener los proveedores', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:100',
                'contacto_nombre' => 'required|string|max:100',
                'email' => 'required|email|max:100|unique:proveedores,email',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:500',
                'notas' => 'nullable|string',
                'activo' => 'nullable|boolean',
            ]);

            $proveedor = Proveedor::create($validated);
            return $this->successResponse($proveedor, 'Proveedor creado correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear el proveedor', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            return $this->successResponse($proveedor, 'Proveedor obtenido correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Proveedor no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener proveedor', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);

            $validated = $request->validate([
                'nombre' => 'sometimes|required|string|max:100',
                'contacto_nombre' => 'sometimes|required|string|max:100',
                'email' => 'sometimes|required|email|max:100|unique:proveedores,email,' . $id,
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:500',
                'notas' => 'nullable|string',
                'activo' => 'nullable|boolean',
            ]);

            $proveedor->update($validated);
            return $this->successResponse($proveedor, 'Proveedor actualizado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Proveedor no encontrado');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar el proveedor', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            $proveedor->delete();
            return $this->successResponse(null, 'Proveedor eliminado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Proveedor no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar el proveedor', $e->getMessage());
        }
    }
}

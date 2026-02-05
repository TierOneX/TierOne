<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreProveedorRequest;
use App\Http\Requests\UpdateProveedorRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{

    use ApiResponseTrait; //Importar el trait

    /**
     * Summary of index
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
     * Show the form for creating a new resource.
     */
    // Metodo create eliminado

    /**
     * Summary of store
     * @param Request $request
     * @return JsonResponse
     */
    /**
     * Summary of store
     * @param StoreProveedorRequest $request
     * @return JsonResponse
     */
    public function store(StoreProveedorRequest $request): JsonResponse
    {
        try {
            $proveedor = Proveedor::create($request->validated());
            return $this->successResponse($proveedor, 'Proveedor creado correctamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear el proveedor', $e->getMessage());
        }
    }

    /**
     * Summary of show
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            return $this->successResponse($proveedor, 'Proveedor Obtenido Correctamente');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Proveedor no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener proveedor', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    // Metodo edit eliminado

    /**
     * Summary of update
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    /**
     * Summary of update
     * @param UpdateProveedorRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateProveedorRequest $request, string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            $proveedor->update($request->validated());
            return $this->successResponse($proveedor, 'Proveedor actualizado correctamente');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Proveedor no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar el proveedor', $e->getMessage());
        }
    }

    /**
     * Summary of destroy
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

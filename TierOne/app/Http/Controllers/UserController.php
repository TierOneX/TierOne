<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponseTrait;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponseTrait;

    /**
     * Summary of index
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $usuarios = User::all();
            return $this->successResponse($usuarios, 'Usuarios obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener los usuarios', $e->getMessage());
        }
    }

    // Metodo create eliminado (API no usa vistas)

    /**
     * Summary of store
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $usuario = User::create($request->validated());
            return $this->successResponse($usuario, 'Usuario creado correctamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear el usuario', $e->getMessage());
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
            $usuario = User::findOrFail($id);
            return $this->successResponse($usuario, 'Usuario obtenido correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Usuario no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener usuario', $e->getMessage());
        }
    }

    // Metodo edit eliminado (API no usa vistas)

    /**
     * Summary of update
     * @param UpdateUserRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        try {
            $usuario = User::findOrFail($id);
            $usuario->update($request->validated());
            return $this->successResponse($usuario, 'Usuario actualizado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Usuario no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al actualizar el usuario', $e->getMessage());
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
            $usuario = User::findOrFail($id);
            $usuario->delete();
            return $this->successResponse($usuario, 'Usuario eliminado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Usuario no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar el usuario', $e->getMessage());
        }
    }
}

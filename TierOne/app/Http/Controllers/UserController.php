<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponseTrait;
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Summary of store
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|max:255|unique:users,username',
                'email' => 'required|email|max:255|unique:users,email',
                'password_hash' => 'required|string|max:255',
                'nombre' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'pais' => 'required|string|max:100',
                'rol' => 'nullable|in:player,admin,streamer',
                'verificado' => 'nullable|boolean',
                'activo' => 'nullable|boolean',
            ]);

            $usuario = User::create($validated);
            return $this->successResponse($usuario, 'Usuario creado correctamente', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Summary of update
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $usuario = User::findOrFail($id);
            $validated = $request->validate([
                'username' => 'sometimes|required|string|max:255|unique:users,username,' . $id,
                'email' => 'sometimes|required|email|max:255|unique:users,email,' . $id,
                'password_hash' => 'sometimes|required|string|min:8',
                'nombre' => 'sometimes|required|string|max:255',
                'apellido' => 'sometimes|required|string|max:255',
                'pais' => 'sometimes|required|string|max:100',
                'rol' => 'nullable|in:player,admin,streamer',
                'verificado' => 'nullable|boolean',
                'activo' => 'nullable|boolean',
            ]);

            $usuario->update($validated);
            return $this->successResponse($usuario, 'Usuario actualizado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Usuario no encontrado');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
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
            return $this->successResponse(null, 'Usuario eliminado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Usuario no encontrado');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar el usuario', $e->getMessage());
        }
    }
}

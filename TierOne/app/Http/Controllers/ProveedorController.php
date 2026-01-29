<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use App\Traits\ApiResponseTrait;
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
            return $this->validationErrorResponse($e->errors());
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
            $proveedor = Proveedor::findOrFail($id);

            //Validar 
            $validated = $request->validate([
                'nombre' => 'sometimes|required|string|max:100',
                'contacto_nombre' => 'sometimes|required|string|max:100',
                'email' => 'sometimes|required|email|max:100|unique:proveedores,email,' . $id,
                'telefono'=> 'nullable|string|max:20',
                'direccion'=> 'nullable|string|max:500',
                'notas'=> 'nullable|string',
                'activo'=> 'nullable|boolean',
            ]);

            $proveedor->update($validated);
            return $this->successResponse($proveedor,'Proveedor actualizado correctamente');

        }catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Proveedor no encontrado');
        }catch(\Illuminate\Validation\ValidationException $e){
            return $this->validationErrorResponse($e->errors());
        }
    }

    /**
     * Summary of destroy
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try{
            $proveedor = Proveedor::findOrFail($id);
            $proveedor->delete();
            return $this->successResponse($proveedor,'Proveedor eliminado correctamente');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Proveedor no encontrado');
        } catch (\Exception $e) {
        return$this->errorResponse('Error al eliminar el proveedor',$e->getMessage());
        }
    }
}

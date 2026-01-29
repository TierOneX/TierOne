<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use function PHPUnit\Framework\returnArgument;

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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
        } catch(\Exception $e){
            return $this->errorResponse('Error al crear el provedor', $e->getMessage());
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

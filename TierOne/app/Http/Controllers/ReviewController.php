<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of reviews, filterable by product or user.
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Review::with('user');

            if ($request->has('id_producto')) {
                $query->where('id_producto', $request->query('id_producto'));
            }
            if ($request->has('id_usuario')) {
                $query->where('id_usuario', $request->query('id_usuario'));
            }

            $reviews = $query->latest()->get();
            return $this->successResponse($reviews, 'Reviews obtenidas');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener reviews', $e->getMessage());
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
                'id_producto' => 'required|exists:productos,id',
                'id_usuario' => 'required|exists:users,id',
                'calificacion' => 'required|integer|min:1|max:5',
                'comentario' => 'required|string|max:1000',
                'verificado_compra' => 'boolean' // Idealmente esto se verifica en backend, no por input
            ]);

            // Evitar duplicados? Un usuario solo una review por producto?
            // $exists = Review::where('id_producto', $validated['id_producto'])->where('id_usuario', $validated['id_usuario'])->exists();
            // if ($exists) return $this->errorResponse('Ya has valorado este producto', 409);

            $review = Review::create($validated);
            return $this->successResponse($review, 'Review creada', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->validator->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error al crear review', $e->getMessage());
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
            $review = Review::findOrFail($id);
            return $this->successResponse($review, 'Review obtenida');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener review', $e->getMessage());
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
            $review = Review::findOrFail($id);
            $review->delete();
            return $this->successResponse(null, 'Review eliminada');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al eliminar review', $e->getMessage());
        }
    }
}

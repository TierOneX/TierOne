<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{

    /**
     * Respuesta Exitosa 
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    protected function successResponse($data, string $message = 'Operación exitosa', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message
        ], $code);
    }

    /**
     * Respuesta Error
     * @param string $message
     * @param mixed $error
     * @param int $code
     * @return JsonResponse
     */
    protected function errorResponse(string $message = 'Error en el servidor', $error = null, int $code = 500): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => $error
        ], $code);
    }

    /**
     * Respuesta de Validación
     * @param mixed $errors
     * @param string $message
     * @return JsonResponse
     */
    protected function validationErrorResponse($errors, string $message = 'Error de validación', int $code = 422): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $code);
    }

    /**
     * Respuesta de Recurso no encontrado
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    protected function notFoundResponse(string $message = 'Recurso no encontrado', int $code = 404): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $code);
    }
}
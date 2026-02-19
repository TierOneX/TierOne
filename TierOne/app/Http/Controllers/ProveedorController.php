<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProveedorController extends Controller
{
    /**
     * Lista todos los proveedores con filtrado y paginación.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['nombre', 'email', 'activo', 'search', 'sort_dir']);
        $sortDir = $request->input('sort_dir', 'desc');
        $filters['sort_dir'] = $sortDir;

        return Inertia::render('PanelAdminEcommerce/Proveedores', [
            'proveedores' => Proveedor::query()
                ->when($filters['search'] ?? null, function($q, $v) {
                    $q->where(function($sq) use ($v) {
                        $sq->where('id', 'like', "%$v%")
                           ->orWhere('nombre', 'like', "%$v%")
                           ->orWhere('contacto_nombre', 'like', "%$v%")
                           ->orWhere('email', 'like', "%$v%")
                           ->orWhere('telefono', 'like', "%$v%");
                    });
                })
                ->when($filters['nombre'] ?? null, fn($q, $v) => $q->where('nombre', 'like', "%$v%"))
                ->when($filters['email'] ?? null, fn($q, $v) => $q->where('email', 'like', "%$v%"))
                ->when($filters['activo'] ?? null, function($q, $v) {
                    if ($v !== 'all') {
                        $q->where('activo', $v === '1');
                    }
                })
                ->orderBy('fecha_registro', $sortDir)
                ->paginate(15)
                ->withQueryString(),
            'filters' => $filters
        ]);
    }

    /**
     * Almacena un nuevo proveedor.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'contacto_nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string',
            'notas' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        Proveedor::create($validated);

        return redirect()->back()->with('success', 'Proveedor creado correctamente.');
    }

    /**
     * Actualiza un proveedor existente.
     */
    public function update(Request $request, Proveedor $proveedor)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'contacto_nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string',
            'notas' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        $proveedor->update($validated);

        return redirect()->back()->with('success', 'Proveedor actualizado correctamente.');
    }

    /**
     * Elimina un proveedor.
     */
    public function destroy(Proveedor $proveedor)
    {
        $proveedor->delete();

        return redirect()->back()->with('success', 'Proveedor eliminado correctamente.');
    }
}

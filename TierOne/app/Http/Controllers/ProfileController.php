<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Muestra la página de perfil completa del usuario autenticado.
     * Carga: datos del usuario, torneos organizados, torneos inscritos y órdenes.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Torneos que el usuario ha organizado
        $torneosOrganizados = $user->torneosOrganizados()
            ->with('juego:id,nombre,imagen_url')
            ->orderByDesc('fecha_inicio')
            ->get(['id', 'id_juego', 'nombre', 'estado', 'fecha_inicio', 'fecha_fin', 'premio_total', 'es_gratuito', 'cuota_inscripcion', 'max_participantes']);

        // Torneos en los que está inscrito
        $torneosInscritos = $user->inscripcionesTorneos()
            ->with([
                'torneo' => function ($q) {
                    $q->with('juego:id,nombre,imagen_url')
                        ->select('id', 'id_juego', 'nombre', 'estado', 'fecha_inicio', 'fecha_fin', 'premio_total');
                }
            ])
            ->orderByDesc('fecha_inscripcion')
            ->get(['id', 'id_torneo', 'fecha_inscripcion', 'estado', 'pago_cuota']);

        // Historial de compras con items y nombre del producto
        $ordenes = $user->ordenes()
            ->with(['items.producto:id,nombre,slug,imagen_principal', 'items.variante:id,nombre'])
            ->orderByDesc('fecha_orden')
            ->get(['id', 'numero_orden', 'total', 'estado', 'fecha_orden', 'tracking_number', 'transportista']);

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'torneosOrganizados' => $torneosOrganizados,
            'torneosInscritos' => $torneosInscritos,
            'ordenes' => $ordenes,
        ]);
    }

    /**
     * Actualiza los datos del perfil (username, nombre, apellido, pais, email).
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Cambia la contraseña del usuario.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        // Verificar contraseña actual
        if (!Hash::check($validated['current_password'], $request->user()->password_hash)) {
            return back()->withErrors(['current_password' => 'La contraseña actual no es correcta.']);
        }

        $request->user()->update([
            'password_hash' => Hash::make($validated['password']),
        ]);

        return Redirect::route('profile.edit')->with('status', 'password-updated');
    }

    /**
     * Elimina la cuenta del usuario.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required'],
        ]);

        if (!Hash::check($request->password, $request->user()->password_hash)) {
            return back()->withErrors(['password' => 'La contraseña no es correcta.']);
        }

        $user = $request->user();
        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

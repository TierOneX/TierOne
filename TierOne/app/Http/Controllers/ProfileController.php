<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
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
        $user = $request->user();
        $validated = $request->validated();
        $now = now();

        if (
            array_key_exists('username', $validated)
            && $validated['username'] !== $user->username
        ) {
            if (($user->username_changes_count ?? 0) >= 2) {
                throw ValidationException::withMessages([
                    'username' => 'Has alcanzado el máximo de 2 cambios de nombre de usuario.',
                ]);
            }

            $validated['username_changes_count'] = (int) ($user->username_changes_count ?? 0) + 1;
            $validated['last_username_changed_at'] = $now;
        }

        if (
            array_key_exists('email', $validated)
            && $validated['email'] !== $user->email
        ) {
            if ($user->email_change_blocked_until && $now->lt($user->email_change_blocked_until)) {
                throw ValidationException::withMessages([
                    'email' => 'No puedes cambiar el correo hasta ' . $user->email_change_blocked_until->format('d/m/Y') . '.',
                ]);
            }

            $validated['last_email_changed_at'] = $now;
            $validated['email_change_blocked_until'] = $now->copy()->addDays(40);
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->verificado = false;
        }

        $user->save();

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

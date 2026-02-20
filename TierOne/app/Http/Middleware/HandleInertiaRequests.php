<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'menu_admin' => [
                [
                    'title' => 'Catálogo',
                    'items' => [
                        ['label' => 'Productos', 'icon' => '📦', 'link' => route('panel.ecommerce.products')],
                        ['label' => 'Categorías', 'icon' => '🏷️', 'link' => route('panel.ecommerce.categories')],
                        ['label' => 'Proveedores', 'icon' => '🚚', 'link' => route('panel.ecommerce.proveedores')],
                    ]
                ],
                [
                    'title' => 'Ventas',
                    'items' => [
                        ['label' => 'Órdenes', 'icon' => '📋', 'link' => route('panel.ecommerce.orders')],
                        ['label' => 'Pagos', 'icon' => '💳', 'link' => route('panel.ecommerce.finanzas.pagos')],
                        ['label' => 'Transacciones', 'icon' => '📊', 'link' => route('panel.ecommerce.finanzas.transacciones')],
                        ['label' => 'Retiros', 'icon' => '🏦', 'link' => route('panel.ecommerce.finanzas.retiros')],
                        ['label' => 'Reseñas', 'icon' => '⭐', 'link' => route('panel.ecommerce.reviews')],
                    ]
                ],
                [
                    'title' => 'Sistema',
                    'items' => [
                        ['label' => 'Reportes', 'icon' => '⚠️', 'link' => route('panel.ecommerce.reports')],
                        ['label' => 'Configuración', 'icon' => '⚙️', 'link' => '#'],
                    ]
                ],
            ],
        ];
    }
}

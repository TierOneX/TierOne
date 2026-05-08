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
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'menu_admin' => [
                [
                    'title' => 'Catálogo',
                    'items' => [
                        ['label' => 'Productos', 'icon' => 'Package', 'link' => route('panel.ecommerce.products')],
                        ['label' => 'Categorías', 'icon' => 'Tag', 'link' => route('panel.ecommerce.categories')],
                        ['label' => 'Proveedores', 'icon' => 'Truck', 'link' => route('panel.ecommerce.proveedores')],
                    ]
                ],
                [
                    'title' => 'Ventas',
                    'items' => [
                        ['label' => 'Órdenes', 'icon' => 'ClipboardList', 'link' => route('panel.ecommerce.orders')],
                        ['label' => 'Pagos', 'icon' => 'CreditCard', 'link' => route('panel.ecommerce.finanzas.pagos')],
                        ['label' => 'Transacciones', 'icon' => 'BarChart3', 'link' => route('panel.ecommerce.finanzas.transacciones')],
                        ['label' => 'Retiros', 'icon' => 'Building2', 'link' => route('panel.ecommerce.finanzas.retiros')],
                        ['label' => 'Reseñas', 'icon' => 'Star', 'link' => route('panel.ecommerce.reviews')],
                    ]
                ],
                [
                    'title' => 'Sistema',
                    'items' => [
                        ['label' => 'Configuración', 'icon' => 'Settings', 'link' => '#'],
                    ]
                ],
            ],
        ];
    }
}

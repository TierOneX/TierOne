<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ComunicacionProveedor;
use App\Models\Orden;
use App\Models\Proveedor;

class ComunicacionProveedorSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $ordenes = Orden::all();
        $proveedores = Proveedor::all();

        if ($ordenes->isEmpty() || $proveedores->isEmpty()) {
            return;
        }

        $tipos = ['email', 'ticket', 'telefono', 'api'];

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            $orden = $ordenes->random();
            $proveedor = $proveedores->random();
            
            ComunicacionProveedor::create([
                'id_orden' => $orden->id,
                'id_proveedor' => $proveedor->id,
                'tipo' => $tipos[array_rand($tipos)],
                'asunto' => 'Consulta sobre envío de orden #' . $orden->numero_orden,
                'contenido_email' => 'Hola, ¿podrían darnos noticias sobre el estado del envío?',
                'email_from' => 'admin@tierone.com',
                'email_to' => $proveedor->email ?? 'proveedor@test.com',
                'fecha_respuesta' => rand(0, 1) ? now() : null,
                'respuesta_contenido' => rand(0, 1) ? 'Su pedido está en camino.' : null,
                'leido' => (bool)rand(0, 1),
            ]);
        }
    }
}

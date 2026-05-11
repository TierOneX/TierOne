<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncUserInvoiceData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:sync-invoice-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza datos de direcciones de envío existentes a los nuevos campos fiscales de los usuarios';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = \App\Models\User::all();
        $count = 0;

        $this->info("Iniciando sincronización de datos para " . $users->count() . " usuarios...");

        foreach ($users as $user) {
            // Siempre generar DNI si no tiene uno
            if (!$user->dni_cif) {
                $user->update(['dni_cif' => rand(10000000, 99999999) . chr(rand(65, 90))]);
            }

            // Intentar encontrar una dirección para autocompletar otros campos
            $direccion = $user->carritos()->latest()->first()?->direccionEnvio 
                ?? \App\Models\DireccionEnvio::where('id_usuario', $user->id)
                    ->orderBy('predeterminada', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->first();

            if ($direccion) {
                $user->update([
                    'telefono'      => $user->telefono ?? $direccion->telefono,
                    'direccion'     => $user->direccion ?? $direccion->direccion_linea1,
                    'codigo_postal' => $user->codigo_postal ?? $direccion->codigo_postal,
                    'ciudad'        => $user->ciudad ?? $direccion->ciudad,
                    'provincia'     => $user->provincia ?? $direccion->estado_provincia,
                ]);
            } else {
                // Si no hay ninguna dirección, ponemos datos genéricos de prueba
                $user->update([
                    'telefono'      => $user->telefono ?? '+34 600000000',
                    'direccion'     => $user->direccion ?? 'Calle de Prueba 123',
                    'codigo_postal' => $user->codigo_postal ?? '28001',
                    'ciudad'        => $user->ciudad ?? 'Madrid',
                    'provincia'     => $user->provincia ?? 'Madrid',
                ]);
            }

            // IMPORTANTE: Actualizar todas las direcciones físicas de este usuario para que no tengan "Calle Falsa"
            \App\Models\DireccionEnvio::where('id_usuario', $user->id)->update([
                'direccion_linea1' => $user->direccion,
                'ciudad'           => $user->ciudad,
                'estado_provincia' => $user->provincia,
                'codigo_postal'    => $user->codigo_postal,
                'telefono'         => $user->telefono,
            ]);

            $count++;
        }

        $this->info("Sincronización completada. Se actualizaron $count usuarios.");
    }
}

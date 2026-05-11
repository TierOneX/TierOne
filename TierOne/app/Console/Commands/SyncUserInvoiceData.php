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
            // Intentar encontrar una dirección predeterminada
            $direccion = $user->carritos()->latest()->first()?->direccionEnvio // O buscar en DireccionEnvio directamente
                ?? \App\Models\DireccionEnvio::where('id_usuario', $user->id)
                    ->orderBy('predeterminada', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->first();

            if ($direccion) {
                $user->update([
                    'dni_cif'       => $user->dni_cif ?? (rand(10000000, 99999999) . chr(rand(65, 90))),
                    'telefono'      => $user->telefono ?? $direccion->telefono,
                    'direccion'     => $user->direccion ?? $direccion->direccion_linea1,
                    'codigo_postal' => $user->codigo_postal ?? $direccion->codigo_postal,
                    'ciudad'        => $user->ciudad ?? $direccion->ciudad,
                    'provincia'     => $user->provincia ?? $direccion->estado_provincia,
                ]);
                $count++;
            }
        }

        $this->info("Sincronización completada. Se actualizaron $count usuarios.");
    }
}

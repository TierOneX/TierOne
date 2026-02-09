<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proveedor;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Proveedor::create([
            'nombre' => 'Gaming Supplies Co.',
            'contacto_nombre' => 'Carlos Martínez',
            'email' => 'contacto@gamingsupplies.com',
            'telefono' => '+34 912 345 678',
            'direccion' => 'Calle Mayor 123, Madrid, España',
            'notas' => 'Proveedor principal de periféricos gaming',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Tech Distributors SA',
            'contacto_nombre' => 'Ana Rodríguez',
            'email' => 'ventas@techdist.com',
            'telefono' => '+52 55 1234 5678',
            'direccion' => 'Av. Reforma 456, CDMX, México',
            'notas' => 'Distribuidor de hardware y componentes',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Digital Games Store',
            'contacto_nombre' => 'Luis Fernández',
            'email' => 'info@digitalgames.com',
            'telefono' => '+54 11 9876 5432',
            'direccion' => 'Av. Corrientes 789, Buenos Aires, Argentina',
            'notas' => 'Especializado en códigos de juegos digitales',
            'activo' => false,
        ]);
    }
}

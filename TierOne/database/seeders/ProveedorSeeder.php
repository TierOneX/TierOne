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

        Proveedor::create([
            'nombre' => 'Global Hardware Ltd.',
            'contacto_nombre' => 'John Smith',
            'email' => 'sales@globalhardware.com',
            'telefono' => '+1 212 555 0199',
            'direccion' => '5th Ave 101, New York, USA',
            'notas' => 'Proveedor internacional de componentes base',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Asia Tech Hub',
            'contacto_nombre' => 'Li Wei',
            'email' => 'li.wei@asiatechub.com',
            'telefono' => '+86 10 6543 2100',
            'direccion' => 'Haidian District, Beijing, China',
            'notas' => 'Fabricante directo de periféricos OEM',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Euro Gaming Logistics',
            'contacto_nombre' => 'Hans Schmidt',
            'email' => 'h.schmidt@eurogaming.de',
            'telefono' => '+49 30 1234567',
            'direccion' => 'Alexanderplatz 1, Berlin, Germany',
            'notas' => 'Logística y distribución en zona Euro',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Latam Gaming Network',
            'contacto_nombre' => 'Clara Soler',
            'email' => 'clara.soler@latamgaming.net',
            'telefono' => '+56 2 2345 6789',
            'direccion' => 'Av. Providencia 321, Santiago, Chile',
            'notas' => 'Distribuidor líder en el cono sur',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Pro Sound Systems',
            'contacto_nombre' => 'Mark Jansen',
            'email' => 'mark@prosoundsystems.nl',
            'telefono' => '+31 20 543 2100',
            'direccion' => 'Damrak 45, Amsterdam, Netherlands',
            'notas' => 'Especialistas en audio y microfonía profesional',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Office & Gaming Chairs Co.',
            'contacto_nombre' => 'Sarah Johnson',
            'email' => 's.johnson@ogchairs.co.uk',
            'telefono' => '+44 20 7946 0000',
            'direccion' => 'Oxford St 500, London, UK',
            'notas' => 'Fabricante de mobiliario ergonómico',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Merch Universe',
            'contacto_nombre' => 'Marta Domínguez',
            'email' => 'marta@merchuniverse.es',
            'telefono' => '+34 934 567 890',
            'direccion' => 'Passeig de Gràcia 78, Barcelona, España',
            'notas' => 'Merchandising oficial de equipos eSports',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Silicon Valley Parts',
            'contacto_nombre' => 'David Miller',
            'email' => 'd.miller@svparts.com',
            'telefono' => '+1 408 555 0123',
            'direccion' => 'Palo Alto, California, USA',
            'notas' => 'Componentes críticos y prototipos',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Tokyo Gadgets',
            'contacto_nombre' => 'Kenji Tanaka',
            'email' => 'k.tanaka@tokyogadgets.jp',
            'telefono' => '+81 3 3456 7890',
            'direccion' => 'Akihabara, Tokyo, Japan',
            'notas' => 'Accesorios exclusivos y ediciones de coleccionista',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Nordic Hardware Store',
            'contacto_nombre' => 'Erik Larsson',
            'email' => 'erik@nordichardware.se',
            'telefono' => '+46 8 123 4567',
            'direccion' => 'Sveavägen 10, Stockholm, Sweden',
            'notas' => 'Sistemas de refrigeración extrema',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Andes Tech Solutions',
            'contacto_nombre' => 'Julia Méndez',
            'email' => 'ventas@andestech.pe',
            'telefono' => '+51 1 987 654 321',
            'direccion' => 'Miraflores, Lima, Perú',
            'notas' => 'Soluciones tecnológicas empresariales',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Middle East Gaming',
            'contacto_nombre' => 'Ahmed Khan',
            'email' => 'ahmed@megaming.ae',
            'telefono' => '+971 4 123 4567',
            'direccion' => 'Dubai Marina, Dubai, UAE',
            'notas' => 'Distribuidor de lujo para Oriente Próximo',
            'activo' => false,
        ]);

        Proveedor::create([
            'nombre' => 'Oceania Gear',
            'contacto_nombre' => 'Olivia Brown',
            'email' => 'olivia@oceaniagear.com.au',
            'telefono' => '+61 2 9876 5432',
            'direccion' => 'George St, Sydney, Australia',
            'notas' => 'Equipamiento gaming para Australia y NZ',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Iberia Hardware SA',
            'contacto_nombre' => 'Paco González',
            'email' => 'p.gonzalez@iberiahwardware.pt',
            'telefono' => '+351 21 345 6789',
            'direccion' => 'Avenida da Liberdade 10, Lisboa, Portugal',
            'notas' => 'Servicio técnico y distribución en Portugal',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Canadian Tech Supply',
            'contacto_nombre' => 'Jean Tremblay',
            'email' => 'sales@canadiantech.ca',
            'telefono' => '+1 416 555 0101',
            'direccion' => 'Yonge St, Toronto, Canada',
            'notas' => 'Importador mayorista de computación',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Seoul E-Sports Gear',
            'contacto_nombre' => 'Min-ho Kim',
            'email' => 'minho@seoulgear.kr',
            'telefono' => '+82 2 1234 5678',
            'direccion' => 'Gangnam-gu, Seoul, South Korea',
            'notas' => 'Hardware optimizado para pro-players',
            'activo' => true,
        ]);

        Proveedor::create([
            'nombre' => 'Alpine Computing',
            'contacto_nombre' => 'Heidi Müller',
            'email' => 'heidi@alpinecomp.ch',
            'telefono' => '+41 44 123 45 67',
            'direccion' => 'Bahnhofstrasse 20, Zurich, Switzerland',
            'notas' => 'Sistemas silent-PC de alta gama',
            'activo' => true,
        ]);
    }
}

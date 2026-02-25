<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SponsorTorneo;
use App\Models\Torneo;

class SponsorTorneoSeeder extends Seeder
{
    private const TOTAL_RECORDS = 20;

    public function run(): void
    {
        $torneos = Torneo::all();

        if ($torneos->isEmpty()) {
            return;
        }

        $sponsors = [
            'Red Bull', 'Monster Energy', 'Logitech G', 'Razer', 'Intel',
            'AMD', 'Secretlab', 'HyperX', 'Corsair', 'ASUS ROG',
            'MSI', 'ZOWIE', 'SteelSeries', 'NVIDIA', 'Alienware',
            'Samsung Odyssey', 'BenQ', 'AORUS', 'Elgato', 'Discord'
        ];

        for ($i = 0; $i < self::TOTAL_RECORDS; $i++) {
            SponsorTorneo::create([
                'id_torneo' => $torneos->random()->id,
                'nombre_sponsor' => $sponsors[$i % count($sponsors)],
                'logo_url' => "https://example.com/logos/sponsor-$i.png",
                'aportacion' => rand(500, 5000),
                'enlace_web' => 'https://example.com',
                'nivel' => ['oro', 'plata', 'bronce'][rand(0, 2)],
                'activo' => true,
            ]);
        }
    }
}

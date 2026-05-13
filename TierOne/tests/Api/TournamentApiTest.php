<?php

namespace Tests\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Torneo;
use App\Models\Juego;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TournamentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_tournaments_publicly()
    {
        Torneo::factory()->count(3)->create();
        $response = $this->getJson('/api/torneos');
        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_create_tournament()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $juego = Juego::factory()->create();

        $data = [
            'id_juego' => $juego->id,
            'id_organizador' => $user->id,
            'nombre' => 'Torneo Test API',
            'descripcion' => 'Descripción del torneo',
            'imagen_banner' => 'banner.jpg',
            'max_participantes' => 32,
            'fecha_inicio' => now()->addDays(5)->toDateTimeString(),
            'fecha_fin' => now()->addDays(7)->toDateTimeString(),
            'cierre_inscripciones' => now()->addDays(4)->toDateTimeString(),
            'estado' => 'inscripciones',
            'formato' => 'eliminacion_simple',
            'cuota_inscripcion' => 0,
            'premio_total' => 500,
            'comision_plataforma_porcentaje' => 10,
            'es_gratuito' => true,
            'reglas_url' => 'https://example.com/rules',
            'stream_url' => 'https://example.com/stream',
            'verificado' => false
        ];

        $response = $this->postJson('/api/torneos', $data);
        $response->assertStatus(201);
    }
}

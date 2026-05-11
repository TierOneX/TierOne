# 04 — Backend: Servicios Laravel

Siguiendo la arquitectura del proyecto (Controllers → Services → Models), necesitamos tres servicios nuevos en `app/Services/`.

---

## Servicio 1: `TwitchAuthService.php`

**Responsabilidad**: Obtener y renovar el App Access Token de Twitch.
Este token es compartido por IGDB y Twitch Helix.

```php
// app/Services/TwitchAuthService.php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TwitchAuthService
{
    /**
     * Obtener un token válido (de caché o generando uno nuevo).
     * TTL: 55 días (el token dura 60, renovamos con margen).
     */
    public function getAccessToken(): string
    {
        return Cache::remember('twitch:access_token', now()->addDays(55), function () {
            $response = Http::asForm()->post('https://id.twitch.tv/oauth2/token', [
                'client_id'     => config('services.twitch.client_id'),
                'client_secret' => config('services.twitch.client_secret'),
                'grant_type'    => 'client_credentials',
            ]);

            if ($response->failed()) {
                throw new \RuntimeException('Twitch OAuth failed: ' . $response->body());
            }

            return $response->json('access_token');
        });
    }

    /**
     * Headers comunes para todas las llamadas a IGDB y Twitch Helix.
     */
    public function getHeaders(): array
    {
        return [
            'Client-ID'    => config('services.twitch.client_id'),
            'Authorization' => 'Bearer ' . $this->getAccessToken(),
        ];
    }

    /**
     * Forzar renovación del token (si caduca antes de tiempo).
     */
    public function refreshToken(): string
    {
        Cache::forget('twitch:access_token');
        return $this->getAccessToken();
    }
}
```

---

## Servicio 2: `GameService.php`

**Responsabilidad**: Consultar IGDB y sincronizar datos estáticos con la tabla `juegos`.

```php
// app/Services/GameService.php

namespace App\Services;

use App\Models\Juego;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GameService
{
    private const IGDB_BASE = 'https://api.igdb.com/v4';

    // Todos los campos que extraemos de IGDB
    private const IGDB_FIELDS = 'fields name, slug, summary, storyline, '
        . 'cover.image_id, screenshots.image_id, artworks.image_id, '
        . 'videos.video_id, videos.name, '
        . 'genres.name, themes.name, game_modes.name, platforms.name, '
        . 'involved_companies.company.name, involved_companies.developer, involved_companies.publisher, '
        . 'similar_games.name, similar_games.cover.image_id, similar_games.slug, '
        . 'aggregated_rating, aggregated_rating_count, rating, rating_count, '
        . 'first_release_date, websites.url, websites.category, '
        . 'franchises.name, collections.name;';

    public function __construct(
        protected TwitchAuthService $authService
    ) {}

    /**
     * Buscar un juego en IGDB por nombre.
     * Devuelve un array de resultados para que el admin elija.
     */
    public function searchIGDB(string $query, int $limit = 10): array
    {
        $body = self::IGDB_FIELDS . "\nsearch \"{$query}\"; limit {$limit};";

        $response = Http::withHeaders($this->authService->getHeaders())
            ->withBody($body, 'text/plain')
            ->post(self::IGDB_BASE . '/games');

        if ($response->failed()) {
            Log::error('IGDB search failed', ['query' => $query, 'body' => $response->body()]);
            return [];
        }

        return $response->json();
    }

    /**
     * Obtener un juego específico de IGDB por su igdb_id.
     */
    public function getFromIGDB(int $igdbId): ?array
    {
        $body = self::IGDB_FIELDS . "\nwhere id = {$igdbId};";

        $response = Http::withHeaders($this->authService->getHeaders())
            ->withBody($body, 'text/plain')
            ->post(self::IGDB_BASE . '/games');

        if ($response->failed() || empty($response->json())) {
            return null;
        }

        return $response->json()[0];
    }

    /**
     * Sincronizar un juego de TierOne con sus datos de IGDB.
     * Mapea la respuesta de IGDB a los campos de la tabla `juegos`.
     */
    public function syncJuego(Juego $juego, array $igdbData): Juego
    {
        $companies = collect($igdbData['involved_companies'] ?? []);

        $juego->update([
            'igdb_id'               => $igdbData['id'],
            'summary'               => $igdbData['summary'] ?? null,
            'storyline'             => $igdbData['storyline'] ?? null,
            'cover_image_id'        => $igdbData['cover']['image_id'] ?? null,
            'screenshot_ids'        => collect($igdbData['screenshots'] ?? [])
                                        ->pluck('image_id')->values()->toArray(),
            'artwork_ids'           => collect($igdbData['artworks'] ?? [])
                                        ->pluck('image_id')->values()->toArray(),
            'video_ids'             => collect($igdbData['videos'] ?? [])
                                        ->map(fn($v) => [
                                            'video_id' => $v['video_id'],
                                            'name' => $v['name'] ?? 'Trailer',
                                        ])->values()->toArray(),
            'genres'                => collect($igdbData['genres'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'themes'                => collect($igdbData['themes'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'game_modes'            => collect($igdbData['game_modes'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'platforms'             => collect($igdbData['platforms'] ?? [])
                                        ->pluck('name')->values()->toArray(),
            'developer'             => $companies->firstWhere('developer', true)['company']['name'] ?? null,
            'publisher'             => $companies->firstWhere('publisher', true)['company']['name'] ?? null,
            'critic_rating'         => $igdbData['aggregated_rating'] ?? null,
            'critic_rating_count'   => $igdbData['aggregated_rating_count'] ?? null,
            'community_rating'      => $igdbData['rating'] ?? null,
            'community_rating_count'=> $igdbData['rating_count'] ?? null,
            'fecha_lanzamiento'     => isset($igdbData['first_release_date'])
                                        ? Carbon::createFromTimestamp($igdbData['first_release_date'])->toDateString()
                                        : null,
            'similar_game_ids'      => collect($igdbData['similar_games'] ?? [])
                                        ->map(fn($g) => [
                                            'igdb_id' => $g['id'] ?? null,
                                            'name' => $g['name'],
                                            'cover_image_id' => $g['cover']['image_id'] ?? null,
                                            'slug' => $g['slug'] ?? null,
                                        ])->values()->toArray(),
            'websites'              => collect($igdbData['websites'] ?? [])
                                        ->map(fn($w) => [
                                            'category' => $w['category'],
                                            'url' => $w['url'],
                                        ])->values()->toArray(),
            'igdb_synced_at'        => now(),
        ]);

        // Si no tenía descripción propia, usar el summary de IGDB
        if (empty($juego->descripcion) && !empty($igdbData['summary'])) {
            $juego->update(['descripcion' => \Illuminate\Support\Str::limit($igdbData['summary'], 255)]);
        }

        return $juego->fresh();
    }
}
```

---

## Servicio 3: `TwitchStreamService.php`

**Responsabilidad**: Consultar datos en tiempo real de Twitch Helix (streams, clips, ranking).

```php
// app/Services/TwitchStreamService.php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TwitchStreamService
{
    private const HELIX_BASE = 'https://api.twitch.tv/helix';

    public function __construct(
        protected TwitchAuthService $authService
    ) {}

    /**
     * Obtener streams en vivo de un juego.
     * Caché: 90 segundos.
     */
    public function getLiveStreams(string $twitchGameId, int $limit = 8): array
    {
        $cacheKey = "twitch:streams:{$twitchGameId}";

        return Cache::remember($cacheKey, 90, function () use ($twitchGameId, $limit) {
            $response = Http::withHeaders($this->authService->getHeaders())
                ->get(self::HELIX_BASE . '/streams', [
                    'game_id' => $twitchGameId,
                    'first'   => $limit,
                    'type'    => 'live',
                ]);

            if ($response->failed()) return [];

            return collect($response->json('data', []))->map(fn($s) => [
                'user_name'    => $s['user_name'],
                'user_login'   => $s['user_login'],
                'title'        => $s['title'],
                'viewer_count' => $s['viewer_count'],
                'thumbnail_url'=> str_replace(['{width}', '{height}'], ['440', '248'], $s['thumbnail_url']),
                'language'     => $s['language'],
                'started_at'   => $s['started_at'],
            ])->toArray();
        });
    }

    /**
     * Obtener clips populares de la semana de un juego.
     * Caché: 1 hora.
     */
    public function getTopClips(string $twitchGameId, int $limit = 6): array
    {
        $cacheKey = "twitch:clips:{$twitchGameId}";

        return Cache::remember($cacheKey, 3600, function () use ($twitchGameId, $limit) {
            $response = Http::withHeaders($this->authService->getHeaders())
                ->get(self::HELIX_BASE . '/clips', [
                    'game_id'    => $twitchGameId,
                    'first'      => $limit,
                    'started_at' => now()->subDays(7)->toIso8601String(),
                ]);

            if ($response->failed()) return [];

            return collect($response->json('data', []))->map(fn($c) => [
                'title'            => $c['title'],
                'url'              => $c['url'],
                'embed_url'        => $c['embed_url'],
                'broadcaster_name' => $c['broadcaster_name'],
                'creator_name'     => $c['creator_name'],
                'view_count'       => $c['view_count'],
                'thumbnail_url'    => $c['thumbnail_url'],
                'duration'         => $c['duration'],
            ])->toArray();
        });
    }

    /**
     * Obtener el twitch_game_id a partir del nombre del juego.
     * Se usa una sola vez al sincronizar un juego con Twitch.
     */
    public function findGameId(string $gameName): ?string
    {
        $response = Http::withHeaders($this->authService->getHeaders())
            ->get(self::HELIX_BASE . '/games', [
                'name' => $gameName,
            ]);

        if ($response->failed() || empty($response->json('data'))) {
            return null;
        }

        return $response->json('data.0.id');
    }

    /**
     * Obtener el top de juegos en Twitch ahora mismo.
     * Caché: 5 minutos.
     */
    public function getTopGames(int $limit = 20): array
    {
        return Cache::remember('twitch:top_games', 300, function () use ($limit) {
            $response = Http::withHeaders($this->authService->getHeaders())
                ->get(self::HELIX_BASE . '/games/top', [
                    'first' => $limit,
                ]);

            if ($response->failed()) return [];

            return collect($response->json('data', []))->map(fn($g, $i) => [
                'twitch_game_id' => $g['id'],
                'name'           => $g['name'],
                'box_art_url'    => str_replace(['{width}', '{height}'], ['285', '380'], $g['box_art_url']),
                'igdb_id'        => $g['igdb_id'] ?? null,
                'ranking'        => $i + 1,
            ])->toArray();
        });
    }
}
```

---

## Controlador: `GameCommunityController.php`

**Ubicación**: `app/Http/Controllers/Web/` (Inertia, no API pura).

```php
// app/Http/Controllers/Web/GameCommunityController.php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Juego;
use App\Services\GameService;
use App\Services\TwitchStreamService;
use Inertia\Inertia;

class GameCommunityController extends Controller
{
    public function __construct(
        protected GameService $gameService,
        protected TwitchStreamService $twitchStreamService
    ) {}

    /**
     * Página principal de comunidad: listado de juegos enriquecidos.
     */
    public function index()
    {
        $juegos = Juego::where('activo', true)
            ->whereNotNull('igdb_id')
            ->orderByDesc('community_rating')
            ->get();

        $topGames = $this->twitchStreamService->getTopGames(10);

        return Inertia::render('Community/Index', [
            'juegos'   => $juegos,
            'topGames' => $topGames,
        ]);
    }

    /**
     * Ficha individual de juego con toda la información.
     */
    public function show(string $slug)
    {
        $juego = Juego::where('slug', $slug)
            ->where('activo', true)
            ->firstOrFail();

        $liveStreams = [];
        $topClips = [];

        if ($juego->twitch_game_id) {
            $liveStreams = $this->twitchStreamService->getLiveStreams($juego->twitch_game_id);
            $topClips = $this->twitchStreamService->getTopClips($juego->twitch_game_id);
        }

        $torneos = $juego->torneos()
            ->whereIn('estado', ['inscripciones', 'en_curso'])
            ->withCount('inscripciones')
            ->orderBy('fecha_inicio')
            ->take(4)
            ->get();

        return Inertia::render('Community/GameProfile', [
            'juego'       => $juego,
            'liveStreams'  => $liveStreams,
            'topClips'    => $topClips,
            'torneos'     => $torneos,
        ]);
    }
}
```

---

## Comando Artisan: `games:sync`

Para sincronizar juegos existentes con IGDB desde la terminal.

```php
// app/Console/Commands/SyncGamesCommand.php

namespace App\Console\Commands;

use App\Models\Juego;
use App\Services\GameService;
use App\Services\TwitchStreamService;
use Illuminate\Console\Command;

class SyncGamesCommand extends Command
{
    protected $signature = 'games:sync {--slug= : Sincronizar un juego específico} {--all : Sincronizar todos}';
    protected $description = 'Sincroniza juegos de TierOne con datos de IGDB y Twitch';

    public function handle(GameService $gameService, TwitchStreamService $twitchService): int
    {
        if ($slug = $this->option('slug')) {
            $juego = Juego::where('slug', $slug)->first();
            if (!$juego) {
                $this->error("Juego con slug '{$slug}' no encontrado.");
                return 1;
            }
            $this->syncOne($juego, $gameService, $twitchService);
        } elseif ($this->option('all')) {
            Juego::where('activo', true)->each(fn($j) => $this->syncOne($j, $gameService, $twitchService));
        } else {
            $this->info('Usa --slug=nombre o --all');
        }

        return 0;
    }

    private function syncOne(Juego $juego, GameService $gameService, TwitchStreamService $twitchService): void
    {
        $this->info("Sincronizando: {$juego->nombre}...");

        // 1. Buscar en IGDB por nombre
        $results = $gameService->searchIGDB($juego->nombre, 1);
        if (empty($results)) {
            $this->warn("  → No encontrado en IGDB.");
            return;
        }

        // 2. Obtener datos completos
        $igdbData = $gameService->getFromIGDB($results[0]['id']);
        if (!$igdbData) {
            $this->warn("  → Error al obtener datos completos.");
            return;
        }

        // 3. Sincronizar con la BD
        $gameService->syncJuego($juego, $igdbData);
        $this->info("  → IGDB sincronizado (ID: {$igdbData['id']})");

        // 4. Obtener twitch_game_id
        if (!$juego->twitch_game_id) {
            $twitchId = $twitchService->findGameId($juego->nombre);
            if ($twitchId) {
                $juego->update(['twitch_game_id' => $twitchId]);
                $this->info("  → Twitch Game ID: {$twitchId}");
            }
        }
    }
}
```

**Uso:**
```bash
php artisan games:sync --slug=league-of-legends
php artisan games:sync --all
```

---

## Configuración `.env`

Añadir al `.env`:
```env
TWITCH_CLIENT_ID=tu_client_id_aqui
TWITCH_CLIENT_SECRET=tu_client_secret_aqui
```

Añadir a `config/services.php`:
```php
'twitch' => [
    'client_id'     => env('TWITCH_CLIENT_ID'),
    'client_secret' => env('TWITCH_CLIENT_SECRET'),
],
```

---

## Rutas Web (Inertia)

Añadir a `routes/web.php`:
```php
// =========================================================================
// COMMUNITY ROUTES
// =========================================================================

Route::get('/community', [App\Http\Controllers\Web\GameCommunityController::class, 'index'])
    ->name('community.index');

Route::get('/community/{slug}', [App\Http\Controllers\Web\GameCommunityController::class, 'show'])
    ->name('community.show');
```

> [!NOTE]
> Seguimos el patrón actual del proyecto: rutas web con controladores en `Http/Controllers/Web/` que devuelven vistas Inertia. No añadimos rutas API para esto porque el frontend no necesita fetch asíncronos; Inertia ya inyecta los datos como props.

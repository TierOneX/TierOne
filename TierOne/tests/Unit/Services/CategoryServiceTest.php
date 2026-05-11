<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\CategoryService;
use App\Models\Categoria;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryServiceTest extends TestCase
{
    use RefreshDatabase;

    private CategoryService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CategoryService();
    }

    public function test_create_category_generates_slug()
    {
        $data = [
            'nombre' => 'Gaming Gear',
            'descripcion' => 'Accesorios'
        ];

        $categoria = $this->service->createCategory($data);

        $this->assertDatabaseHas('categorias', ['id' => $categoria->id, 'slug' => 'gaming-gear']);
    }

    public function test_get_master_categories()
    {
        Categoria::factory()->create(['id_parent' => null]);
        Categoria::factory()->create(['id_parent' => 1]); // Child

        $results = $this->service->getMasterCategories();

        $this->assertCount(1, $results);
    }
}

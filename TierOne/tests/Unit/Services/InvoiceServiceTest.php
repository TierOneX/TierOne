<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\InvoiceService;
use App\Models\Orden;
use App\Models\ItemOrden;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InvoiceServiceTest extends TestCase
{
    use RefreshDatabase;

    private InvoiceService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InvoiceService();
    }

    /**
     * Test que verifica que el servicio llama al renderizador de PDF.
     */
    public function test_generate_invoice_calls_pdf_renderer()
    {
        $mockResponse = response('pdf_content');

        // Mock del facade PDF
        Pdf::shouldReceive('setOptions')->once()->andReturnSelf();
        Pdf::shouldReceive('loadView')->once()->andReturnSelf();
        Pdf::shouldReceive('setPaper')->once()->andReturnSelf();
        Pdf::shouldReceive('stream')->once()->andReturn($mockResponse);

        $orden = Orden::factory()->create();

        $result = $this->service->generateInvoice($orden, 'stream');

        $this->assertEquals($mockResponse, $result);
    }
}

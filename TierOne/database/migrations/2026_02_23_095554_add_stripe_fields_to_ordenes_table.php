<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     *
     * Añade el campo stripe_payment_intent_id a la tabla ordenes
     * para poder enlazar una orden con su PaymentIntent de Stripe
     * y hacer el seguimiento mediante webhooks.
     */
    public function up(): void
    {
        Schema::table('ordenes', function (Blueprint $table) {
            // ID del PaymentIntent de Stripe (pi_xxxxx)
            // nullable porque se asigna justo después de crear la orden
            $table->string('stripe_payment_intent_id')->nullable()->unique()->after('razon_cancelacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ordenes', function (Blueprint $table) {
            $table->dropColumn('stripe_payment_intent_id');
        });
    }
};

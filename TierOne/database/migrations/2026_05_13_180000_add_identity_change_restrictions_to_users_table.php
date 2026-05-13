<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedTinyInteger('username_changes_count')->default(0)->after('username');
            $table->timestamp('email_change_blocked_until')->nullable()->after('email');
            $table->timestamp('username_change_blocked_until')->nullable()->after('email_change_blocked_until');
            $table->timestamp('last_email_changed_at')->nullable()->after('username_change_blocked_until');
            $table->timestamp('last_username_changed_at')->nullable()->after('last_email_changed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username_changes_count',
                'email_change_blocked_until',
                'username_change_blocked_until',
                'last_email_changed_at',
                'last_username_changed_at',
            ]);
        });
    }
};


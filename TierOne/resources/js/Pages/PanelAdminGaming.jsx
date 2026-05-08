import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function PanelAdminGaming() {
    return (
        <MainLayout>
            <Head title="Panel Admin Gaming" />
            <section className="bg-[#090909] px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[900px] rounded-[28px] border border-white/10 bg-[#111111] p-8 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-red-500">Panel Admin Gaming</p>
                    <h1 className="mt-3 text-3xl font-black uppercase italic text-white sm:text-4xl">En desarrollo</h1>
                    <p className="mt-4 text-sm text-gray-400">
                        Esta seccion todavia no esta implementada. Proximamente podras administrar partidas, torneos y reglas competitivas desde aqui.
                    </p>
                </div>
            </section>
        </MainLayout>
    );
}

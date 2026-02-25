import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Hero from '@/Components/LandingPage/Hero';
import Features from '@/Components/LandingPage/Features';

export default function LandingPage() {
    return (
        <MainLayout>
            <Head title="Welcome - TierOne" />

            <Hero />
            <Features />

        </MainLayout>
    );
}

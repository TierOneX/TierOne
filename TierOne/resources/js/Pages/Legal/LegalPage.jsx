import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

export default function LegalPage({
    title,
    eyebrow = "Informacion legal",
    description,
    updatedAt = "10 de mayo de 2026",
    sections = [],
}) {
    return (
        <MainLayout>
            <Head title={`${title} - TierOne`} />
            <Head>
                <meta name="description" content={description} />
            </Head>

            <section className="bg-[#0a0a0a] px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="border-b border-white/10 pb-10">
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-white"
                        >
                            <span aria-hidden="true">←</span>
                            Volver a TierOne
                        </Link>

                        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e31837]">
                            {eyebrow}
                        </p>
                        <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase tracking-0 text-white sm:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-5 max-w-3xl text-base leading-8 text-gray-400">
                            {description}
                        </p>
                        <p className="mt-6 text-sm font-semibold text-gray-500">
                            Ultima actualizacion: {updatedAt}
                        </p>
                    </div>

                    <div className="grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
                        <aside className="hidden lg:block">
                            <nav className="sticky top-24 space-y-3">
                                {sections.map((section) => (
                                    <a
                                        key={section.title}
                                        href={`#${section.id}`}
                                        className="block border-l border-white/10 px-4 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:border-[#e31837] hover:text-white"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </aside>

                        <div className="space-y-10">
                            {sections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-24 border-b border-white/10 pb-10 last:border-b-0"
                                >
                                    <h2 className="text-2xl font-black uppercase text-white">
                                        {section.title}
                                    </h2>
                                    <div className="mt-5 space-y-4 text-sm leading-7 text-gray-400 sm:text-base">
                                        {section.content.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

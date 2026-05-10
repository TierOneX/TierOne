import { Link } from "@inertiajs/react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "tierone_cookie_consent";

export default function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = window.localStorage.getItem(STORAGE_KEY);
        setIsVisible(!consent);
    }, []);

    const saveConsent = (value) => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                value,
                acceptedAt: new Date().toISOString(),
            }),
        );
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-5 sm:pb-5 lg:inset-x-auto lg:left-6 lg:max-w-[540px]">
            <div className="rounded-lg border border-white/10 bg-[#111114]/95 p-4 text-white shadow-2xl shadow-black/50 backdrop-blur-md sm:p-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e31837]/15 text-[#ff3354]">
                        <Cookie className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">
                                Cookies
                            </h2>
                            <button
                                type="button"
                                onClick={() => saveConsent("dismissed")}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-gray-500 transition-colors hover:border-white/20 hover:text-white"
                                aria-label="Cerrar aviso de cookies"
                                title="Cerrar"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Usamos cookies tecnicas para que la tienda, el
                            carrito y el checkout funcionen correctamente. Con
                            tu permiso tambien podemos usar datos de uso para
                            mejorar TierOne.
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-500">
                            <ShieldCheck
                                className="h-4 w-4 text-green-500"
                                aria-hidden="true"
                            />
                            Puedes cambiar la configuracion desde tu navegador.
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                            <button
                                type="button"
                                onClick={() => saveConsent("accepted")}
                                className="min-h-11 rounded-md bg-[#e31837] px-4 py-2 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#ff2345]"
                            >
                                Aceptar
                            </button>
                            <button
                                type="button"
                                onClick={() => saveConsent("rejected")}
                                className="min-h-11 rounded-md border border-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-white/25 hover:text-white"
                            >
                                Rechazar
                            </button>
                            <Link
                                href="/cookies"
                                className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold text-gray-500 transition-colors hover:text-white sm:justify-start"
                            >
                                Ver politica
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

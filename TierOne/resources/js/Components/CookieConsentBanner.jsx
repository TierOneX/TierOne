import { Link } from "@inertiajs/react";
import {
    BarChart3,
    Check,
    Cookie,
    Megaphone,
    Settings2,
    ShieldCheck,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    defaultCookiePreferences,
    getCookieConsent,
    OPEN_COOKIE_SETTINGS_EVENT,
    saveCookieConsent,
} from "@/Utils/cookieConsent";

const cookieCategories = [
    {
        key: "necessary",
        title: "Necesarias",
        description:
            "Mantienen la sesion, el carrito, la seguridad y el checkout. Siempre estan activas.",
        icon: ShieldCheck,
        required: true,
    },
    {
        key: "preferences",
        title: "Preferencias",
        description:
            "Recuerdan ajustes basicos como idioma, visualizacion o preferencias de navegacion.",
        icon: Settings2,
    },
    {
        key: "analytics",
        title: "Analiticas",
        description:
            "Ayudan a medir el uso de la web para mejorar productos, torneos y rendimiento.",
        icon: BarChart3,
    },
    {
        key: "marketing",
        title: "Marketing",
        description:
            "Permiten personalizar campanas, anuncios o mediciones publicitarias si se activan.",
        icon: Megaphone,
    },
];

export default function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [preferences, setPreferences] = useState(defaultCookiePreferences);

    useEffect(() => {
        const consent = getCookieConsent();
        setIsVisible(!consent);
        setPreferences(consent?.preferences ?? defaultCookiePreferences);

        const openSettings = () => {
            const currentConsent = getCookieConsent();
            setPreferences(currentConsent?.preferences ?? defaultCookiePreferences);
            setIsSettingsOpen(true);
            setIsVisible(true);
        };

        window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);

        return () => {
            window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
        };
    }, []);

    const closeWithPreferences = (nextPreferences) => {
        saveCookieConsent(nextPreferences);
        setIsVisible(false);
        setIsSettingsOpen(false);
    };

    const acceptAll = () => {
        closeWithPreferences({
            necessary: true,
            preferences: true,
            analytics: true,
            marketing: true,
        });
    };

    const rejectOptional = () => {
        closeWithPreferences(defaultCookiePreferences);
    };

    const togglePreference = (key) => {
        setPreferences((current) => ({
            ...current,
            [key]: !current[key],
            necessary: true,
        }));
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-5 sm:pb-5 lg:inset-x-auto lg:left-6 lg:max-w-[620px]">
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
                                onClick={rejectOptional}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-gray-500 transition-colors hover:border-white/20 hover:text-white"
                                aria-label="Rechazar cookies no necesarias"
                                title="Rechazar no necesarias"
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
                            Las opciones no necesarias se mantienen desactivadas
                            hasta que las aceptes.
                        </div>

                        {isSettingsOpen && (
                            <div className="mt-4 space-y-2">
                                {cookieCategories.map((category) => {
                                    const Icon = category.icon;
                                    const checked = Boolean(preferences[category.key]);

                                    return (
                                        <label
                                            key={category.key}
                                            className="flex cursor-pointer items-start gap-3 rounded-md border border-white/10 bg-black/20 p-3 transition-colors hover:border-white/20"
                                        >
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-gray-300">
                                                <Icon
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-black uppercase text-white">
                                                    {category.title}
                                                </span>
                                                <span className="mt-1 block text-xs leading-5 text-gray-500">
                                                    {category.description}
                                                </span>
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                disabled={category.required}
                                                onChange={() =>
                                                    togglePreference(category.key)
                                                }
                                                className="sr-only"
                                            />
                                            <span
                                                className={`mt-1 flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors ${
                                                    checked
                                                        ? "border-[#e31837] bg-[#e31837]"
                                                        : "border-white/15 bg-white/5"
                                                } ${
                                                    category.required
                                                        ? "opacity-70"
                                                        : ""
                                                }`}
                                                aria-hidden="true"
                                            >
                                                <span
                                                    className={`flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#e31837] transition-transform ${
                                                        checked
                                                            ? "translate-x-5"
                                                            : "translate-x-0"
                                                    }`}
                                                >
                                                    {checked && (
                                                        <Check className="h-3 w-3" />
                                                    )}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={acceptAll}
                                className="min-h-11 rounded-md bg-[#e31837] px-4 py-2 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#ff2345]"
                            >
                                Aceptar todas
                            </button>
                            <button
                                type="button"
                                onClick={rejectOptional}
                                className="min-h-11 rounded-md border border-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-white/25 hover:text-white"
                            >
                                Rechazar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (isSettingsOpen) {
                                        closeWithPreferences(preferences);
                                        return;
                                    }

                                    setIsSettingsOpen(true);
                                }}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-white/25 hover:text-white"
                            >
                                <SlidersHorizontal
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                {isSettingsOpen ? "Guardar" : "Configurar"}
                            </button>
                        </div>

                        <div className="mt-3">
                            <Link
                                href="/cookies"
                                className="inline-flex text-xs font-bold text-gray-500 underline-offset-4 transition-colors hover:text-white hover:underline"
                            >
                                Ver politica de cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

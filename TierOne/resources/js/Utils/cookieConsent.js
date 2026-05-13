export const COOKIE_CONSENT_STORAGE_KEY = "tierone_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "tierone:open-cookie-settings";

export const defaultCookiePreferences = {
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
};

export function buildCookieConsent(preferences) {
    return {
        version: 1,
        preferences: {
            ...defaultCookiePreferences,
            ...preferences,
            necessary: true,
        },
        savedAt: new Date().toISOString(),
    };
}

export function getCookieConsent() {
    if (typeof window === "undefined") {
        return null;
    }

    const rawConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

    if (!rawConsent) {
        return null;
    }

    try {
        const consent = JSON.parse(rawConsent);

        if (!consent?.preferences) {
            return null;
        }

        return {
            ...consent,
            preferences: {
                ...defaultCookiePreferences,
                ...consent.preferences,
                necessary: true,
            },
        };
    } catch {
        return null;
    }
}

export function saveCookieConsent(preferences) {
    if (typeof window === "undefined") {
        return null;
    }

    const consent = buildCookieConsent(preferences);

    window.localStorage.setItem(
        COOKIE_CONSENT_STORAGE_KEY,
        JSON.stringify(consent),
    );
    window.dispatchEvent(
        new CustomEvent("tierone:cookie-consent-updated", {
            detail: consent,
        }),
    );

    return consent;
}

export function openCookieSettings() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
    }
}

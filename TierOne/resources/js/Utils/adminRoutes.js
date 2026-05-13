import { usePage } from "@inertiajs/react";

const toSuperAdminName = (name) =>
    name
        .replace(/^panel\.gaming\./, "panel.superadmin.gaming.")
        .replace(/^panel\.ecommerce\./, "panel.superadmin.ecommerce.");

export function useAdminRoutes() {
    const { adminContext } = usePage().props;
    const isSuperAdmin =
        adminContext?.isSuperAdmin ||
        (typeof route === "function" && route().current("panel.superadmin.*"));

    const routeName = (name) => (isSuperAdmin ? toSuperAdminName(name) : name);
    const routeUrl = (name, params, absolute) => route(routeName(name), params, absolute);

    return { isSuperAdmin, routeName, routeUrl };
}

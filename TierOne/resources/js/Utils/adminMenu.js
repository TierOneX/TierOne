export function buildUnifiedAdminMenu(routeUrl = route) {
    return [
        {
            title: "Vista Global",
            items: [
                {
                    label: "Dashboard",
                    icon: "LayoutDashboard",
                    link: routeUrl("panel.superadmin.index"),
                },
            ],
        },
        {
            title: "Gaming",
            items: [
                {
                    label: "Torneos",
                    icon: "Trophy",
                    link: routeUrl("panel.gaming.index", { section: "torneos" }),
                },
                {
                    label: "Partidas",
                    icon: "Swords",
                    link: routeUrl("panel.gaming.index", { section: "partidas" }),
                },
                {
                    label: "Juegos",
                    icon: "Gamepad2",
                    link: routeUrl("panel.gaming.index", { section: "juegos" }),
                },
                {
                    label: "Incidencias",
                    icon: "ShieldAlert",
                    link: routeUrl("panel.gaming.index", { section: "incidencias" }),
                },
                {
                    label: "Cuentas",
                    icon: "UserCog",
                    link: routeUrl("panel.gaming.index", { section: "cuentas" }),
                },
            ],
        },
        {
            title: "Catalogo",
            items: [
                {
                    label: "Productos",
                    icon: "Package",
                    link: routeUrl("panel.ecommerce.products"),
                },
                {
                    label: "Categorías",
                    icon: "Tag",
                    link: routeUrl("panel.ecommerce.categories"),
                },
                {
                    label: "Proveedores",
                    icon: "Truck",
                    link: routeUrl("panel.ecommerce.proveedores"),
                },
            ],
        },
        {
            title: "Ventas",
            items: [
                {
                    label: "Órdenes",
                    icon: "ClipboardList",
                    link: routeUrl("panel.ecommerce.orders"),
                },
                {
                    label: "Pagos",
                    icon: "CreditCard",
                    link: routeUrl("panel.ecommerce.finanzas.pagos"),
                },
                {
                    label: "Transacciones",
                    icon: "BarChart3",
                    link: routeUrl("panel.ecommerce.finanzas.transacciones"),
                },
                {
                    label: "Retiros",
                    icon: "Building2",
                    link: routeUrl("panel.ecommerce.finanzas.retiros"),
                },
                {
                    label: "Reseñas",
                    icon: "Star",
                    link: routeUrl("panel.ecommerce.reviews"),
                },
            ],
        },
    ];
}

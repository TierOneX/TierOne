import LegalPage from "./LegalPage";

const sections = [
    {
        id: "cuenta",
        title: "Cuenta",
        content: [
            "Si tienes problemas para acceder, revisa que el email sea correcto y utiliza la recuperacion de contrasena desde la pantalla de inicio de sesion.",
            "Mantener tus datos actualizados ayuda a gestionar pedidos, facturas, envios y comunicaciones de torneos.",
        ],
    },
    {
        id: "compras",
        title: "Compras",
        content: [
            "Puedes anadir productos al carrito, revisar el resumen del pedido y completar el pago desde checkout. Si el pago falla, comprueba los datos introducidos o prueba otro metodo compatible.",
        ],
    },
    {
        id: "personalizacion",
        title: "Personalizacion",
        content: [
            "Algunos productos permiten personalizacion. Revisa bien el diseno antes de confirmar, ya que los articulos personalizados pueden tener condiciones especiales de devolucion.",
        ],
    },
    {
        id: "torneos",
        title: "Torneos",
        content: [
            "Antes de inscribirte en una competicion, revisa horarios, requisitos, formato, juego, plazas disponibles y reglas especificas.",
        ],
    },
    {
        id: "incidencias",
        title: "Incidencias",
        content: [
            "Cuando abras una incidencia, aporta detalles claros: navegador, dispositivo, usuario, numero de pedido o partida, y pasos para reproducir el problema si es tecnico.",
        ],
    },
];

export default function Help() {
    return (
        <LegalPage
            eyebrow="Soporte"
            title="Centro de Ayuda"
            description="Preguntas frecuentes y pautas para compras, cuentas, personalizacion, torneos e incidencias en TierOne."
            sections={sections}
        />
    );
}

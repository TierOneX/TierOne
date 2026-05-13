import LegalPage from "./LegalPage";
import { openCookieSettings } from "@/Utils/cookieConsent";

const sections = [
    {
        id: "que-son",
        title: "Que son las cookies",
        content: [
            "Las cookies son pequenos archivos que se guardan en tu dispositivo para recordar informacion sobre tu navegacion, mantener sesiones activas y mejorar el funcionamiento de la web.",
        ],
    },
    {
        id: "tipos",
        title: "Tipos de cookies",
        content: [
            "TierOne puede utilizar cookies tecnicas necesarias para iniciar sesion, mantener el carrito, proteger formularios, procesar pagos y recordar preferencias basicas.",
            "Tambien pueden existir cookies de preferencias, medicion o analitica y marketing para entender el uso de la plataforma, mejorar la experiencia o personalizar comunicaciones, solo cuando hayas dado tu consentimiento cuando sea necesario.",
        ],
    },
    {
        id: "terceros",
        title: "Cookies de terceros",
        content: [
            "Algunas funcionalidades pueden depender de terceros, como proveedores de pago, servicios de seguridad, contenido incrustado o herramientas de analitica.",
            "Estos terceros pueden instalar cookies propias sujetas a sus respectivas politicas.",
        ],
    },
    {
        id: "gestion",
        title: "Como gestionarlas",
        content: [
            "Puedes aceptar, rechazar o configurar las cookies no necesarias desde el panel de preferencias de TierOne. Tambien puedes bloquear o eliminar cookies desde la configuracion de tu navegador. Si desactivas cookies tecnicas, algunas funciones como el carrito, el inicio de sesion o el checkout podrian dejar de funcionar correctamente.",
        ],
    },
    {
        id: "actualizaciones",
        title: "Actualizaciones",
        content: [
            "TierOne podra actualizar esta politica cuando cambien las cookies utilizadas, la normativa aplicable o las funcionalidades de la plataforma.",
        ],
    },
];

export default function Cookies() {
    return (
        <LegalPage
            title="Politica de Cookies"
            description="Informacion sobre el uso de cookies y tecnologias similares en la plataforma TierOne."
            sections={sections}
        >
            <button
                type="button"
                onClick={openCookieSettings}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#e31837] px-5 py-2 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-[#ff2345]"
            >
                Configurar cookies
            </button>
        </LegalPage>
    );
}

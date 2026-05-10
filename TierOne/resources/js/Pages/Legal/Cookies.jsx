import LegalPage from "./LegalPage";

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
            "Tambien pueden existir cookies de medicion o analitica para entender el uso de la plataforma y mejorar la experiencia, siempre de acuerdo con la normativa aplicable.",
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
            "Puedes bloquear o eliminar cookies desde la configuracion de tu navegador. Si desactivas cookies tecnicas, algunas funciones como el carrito, el inicio de sesion o el checkout podrian dejar de funcionar correctamente.",
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
        />
    );
}

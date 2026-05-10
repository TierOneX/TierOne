import LegalPage from "./LegalPage";

const sections = [
    {
        id: "objeto",
        title: "Objeto del servicio",
        content: [
            "TierOne ofrece una plataforma de comercio electronico, competiciones, partidas y servicios digitales relacionados con gaming, merchandising y experiencias de comunidad.",
            "El uso de la web implica la aceptacion de estas condiciones. Si no estas de acuerdo, debes dejar de utilizar la plataforma.",
        ],
    },
    {
        id: "cuenta",
        title: "Cuenta de usuario",
        content: [
            "Para comprar, inscribirte en torneos o participar en determinadas funcionalidades puede ser necesario crear una cuenta. Debes facilitar datos veraces y mantener la confidencialidad de tus credenciales.",
            "TierOne puede suspender cuentas cuando detecte fraude, suplantacion, abuso de la plataforma, trampas en competiciones o incumplimientos graves de estas condiciones.",
        ],
    },
    {
        id: "compras",
        title: "Compras y pagos",
        content: [
            "Los precios se muestran en euros e incluyen los impuestos aplicables salvo que se indique lo contrario. Antes de confirmar el pago se mostrara un resumen del pedido.",
            "Los pagos se procesan mediante proveedores externos seguros. TierOne no almacena los datos completos de tu tarjeta bancaria.",
        ],
    },
    {
        id: "torneos",
        title: "Torneos y partidas",
        content: [
            "Las competiciones pueden tener reglas especificas de participacion, horarios, requisitos tecnicos y criterios de descalificacion. Al inscribirte aceptas esas reglas particulares.",
            "TierOne se reserva el derecho de revisar resultados, cancelar partidas o tomar medidas disciplinarias cuando existan indicios razonables de conducta antideportiva.",
        ],
    },
    {
        id: "propiedad",
        title: "Propiedad intelectual",
        content: [
            "La marca TierOne, los textos, interfaces, disenos, imagenes y elementos visuales propios de la plataforma estan protegidos por derechos de propiedad intelectual.",
            "No puedes copiar, distribuir, modificar o explotar comercialmente contenidos de TierOne sin autorizacion previa por escrito.",
        ],
    },
    {
        id: "responsabilidad",
        title: "Responsabilidad",
        content: [
            "TierOne trabaja para mantener la plataforma disponible y segura, pero no garantiza que el servicio este libre de interrupciones, errores o incidencias tecnicas puntuales.",
            "La responsabilidad de TierOne queda limitada en los terminos permitidos por la legislacion aplicable, sin afectar a los derechos irrenunciables de consumidores y usuarios.",
        ],
    },
    {
        id: "contacto",
        title: "Contacto",
        content: [
            "Para cualquier consulta sobre estas condiciones puedes contactar con TierOne desde la pagina de contacto o mediante los canales de soporte publicados en la web.",
        ],
    },
];

export default function Terms() {
    return (
        <LegalPage
            title="Terminos de Servicio"
            description="Condiciones que regulan el acceso, compra, participacion en competiciones y uso general de la plataforma TierOne."
            sections={sections}
        />
    );
}

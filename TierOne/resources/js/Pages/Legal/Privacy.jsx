import LegalPage from "./LegalPage";

const sections = [
    {
        id: "responsable",
        title: "Responsable",
        content: [
            "TierOne es responsable del tratamiento de los datos personales recogidos a traves de la plataforma, formularios, compras, cuentas de usuario y participacion en torneos.",
            "Puedes solicitar informacion adicional o ejercer tus derechos desde los canales de contacto publicados en la web.",
        ],
    },
    {
        id: "datos",
        title: "Datos que tratamos",
        content: [
            "Podemos tratar datos identificativos y de contacto, datos de cuenta, direccion de envio, historial de pedidos, informacion de pagos tokenizada, participacion en torneos y comunicaciones con soporte.",
            "Tambien podemos recoger informacion tecnica como direccion IP, dispositivo, navegador, eventos de seguridad y datos de uso necesarios para operar y proteger la plataforma.",
        ],
    },
    {
        id: "finalidades",
        title: "Finalidades",
        content: [
            "Usamos tus datos para gestionar cuentas, pedidos, pagos, envios, devoluciones, soporte, inscripciones a torneos, resultados, comunicaciones operativas y seguridad de la plataforma.",
            "Cuando proceda, tambien podremos enviar comunicaciones comerciales sobre productos, eventos o novedades de TierOne si existe base legal para ello o has dado tu consentimiento.",
        ],
    },
    {
        id: "base-legal",
        title: "Base legal",
        content: [
            "El tratamiento puede basarse en la ejecucion de un contrato, el cumplimiento de obligaciones legales, el interes legitimo en mantener la seguridad y mejorar el servicio, o tu consentimiento.",
            "Puedes retirar tu consentimiento en cualquier momento cuando el tratamiento dependa de el.",
        ],
    },
    {
        id: "conservacion",
        title: "Conservacion",
        content: [
            "Conservaremos tus datos durante el tiempo necesario para prestar el servicio, atender responsabilidades legales, gestionar garantias, prevenir fraude y cumplir obligaciones fiscales o contables.",
        ],
    },
    {
        id: "derechos",
        title: "Tus derechos",
        content: [
            "Puedes solicitar acceso, rectificacion, supresion, oposicion, limitacion del tratamiento y portabilidad de tus datos cuando corresponda.",
            "Tambien puedes presentar una reclamacion ante la autoridad de control competente si consideras que el tratamiento no se ajusta a la normativa aplicable.",
        ],
    },
    {
        id: "terceros",
        title: "Proveedores",
        content: [
            "TierOne puede trabajar con proveedores de hosting, pagos, email, analitica, logistica y soporte. Estos proveedores solo acceden a los datos necesarios para prestar sus servicios.",
        ],
    },
];

export default function Privacy() {
    return (
        <LegalPage
            title="Politica de Privacidad"
            description="Informacion sobre como TierOne recoge, utiliza, conserva y protege tus datos personales."
            sections={sections}
        />
    );
}

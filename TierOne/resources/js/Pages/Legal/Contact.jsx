import LegalPage from "./LegalPage";

const sections = [
    {
        id: "soporte",
        title: "Soporte",
        content: [
            "Para consultas sobre pedidos, pagos, torneos, cuentas o incidencias tecnicas, contacta con el equipo de TierOne indicando el mayor contexto posible.",
            "Incluye numero de pedido, usuario, captura de pantalla o descripcion del problema cuando sea relevante para acelerar la respuesta.",
        ],
    },
    {
        id: "pedidos",
        title: "Pedidos",
        content: [
            "Si tu consulta esta relacionada con una compra, revisaremos el estado del pedido, direccion de envio, pago, factura, devolucion o garantia.",
        ],
    },
    {
        id: "torneos",
        title: "Torneos",
        content: [
            "Para incidencias en partidas o resultados, aporta el torneo, partida, usuarios implicados, hora aproximada y cualquier prueba disponible.",
        ],
    },
    {
        id: "legal",
        title: "Consultas legales",
        content: [
            "Tambien puedes usar los canales de contacto para ejercer derechos de proteccion de datos o realizar consultas sobre terminos, privacidad y cookies.",
        ],
    },
];

export default function Contact() {
    return (
        <LegalPage
            eyebrow="Atencion al usuario"
            title="Contacto"
            description="Canales y criterios de soporte para resolver dudas sobre TierOne, compras, cuentas y competiciones."
            sections={sections}
        />
    );
}

import LegalPage from "./LegalPage";

const sections = [
    {
        id: "envios",
        title: "Envios",
        content: [
            "Los pedidos se envian a la direccion indicada durante el checkout. Antes de confirmar el pago, revisa que los datos de entrega sean correctos.",
            "Los plazos pueden variar segun disponibilidad, destino, transportista y periodos de alta demanda.",
        ],
    },
    {
        id: "seguimiento",
        title: "Seguimiento",
        content: [
            "Cuando el pedido salga de nuestras instalaciones, podras recibir informacion de seguimiento si el transportista la facilita.",
            "Si detectas una incidencia en el transporte, contacta con soporte lo antes posible para que podamos revisarla.",
        ],
    },
    {
        id: "devoluciones",
        title: "Devoluciones",
        content: [
            "Puedes solicitar una devolucion dentro del plazo legal aplicable siempre que el producto este en buen estado, con sus accesorios y embalaje cuando corresponda.",
            "Los productos personalizados pueden tener limitaciones de devolucion, salvo defecto, error de fabricacion o garantia legal aplicable.",
        ],
    },
    {
        id: "reembolsos",
        title: "Reembolsos",
        content: [
            "Una vez recibido y revisado el producto devuelto, tramitaremos el reembolso mediante el metodo de pago original cuando sea posible.",
            "Los tiempos de abono pueden depender de la entidad bancaria o del proveedor de pago.",
        ],
    },
    {
        id: "garantia",
        title: "Garantia",
        content: [
            "Los productos cuentan con las garantias legales aplicables. Si un articulo llega danado o presenta un defecto, contacta con soporte aportando numero de pedido, descripcion e imagenes si procede.",
        ],
    },
];

export default function Shipping() {
    return (
        <LegalPage
            eyebrow="Compras y soporte"
            title="Envios y Devoluciones"
            description="Condiciones generales para entregas, devoluciones, reembolsos y garantia de pedidos realizados en TierOne."
            sections={sections}
        />
    );
}

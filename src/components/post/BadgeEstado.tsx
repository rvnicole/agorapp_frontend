import Badge from "../ui/Badge";
import { estadosDetails } from "../../data/estados";
import type { EstadoStr } from "../../types";
import { Check, ClockAlert, Hammer, UserRoundCheck } from "lucide-react";

const estadosIcons = {
    "asignado": <UserRoundCheck className="size-5" />,
    "pendiente": <ClockAlert className="size-5" />,
    "en progreso": <Hammer className="size-5" />,
    "resuelto": <Check className="size-5" />
}

export default function BadgeEstado({ estado }: { estado: EstadoStr }) {
    const estadoDetail = estadosDetails[estado];
    const icon = estadosIcons[estado];

    return (
        <Badge
            data-slot="etiqueta-estado"
            className={`flex justify-center items-center gap-1 text-white ${estadoDetail.color}`}
        >
            {icon}
            <p>{ estadoDetail.titulo}</p>
        </Badge>
    )
}
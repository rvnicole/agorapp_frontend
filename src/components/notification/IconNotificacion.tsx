import { Info, MessageCircle, RotateCw, ThumbsUp } from "lucide-react";
import type { Notification } from "../../types";

const tiposNotificacion = {
    comentario: {
        icon: MessageCircle,
        color: "text-cyan-500"
    },
    actualizacion: {
        icon: RotateCw,
        color: "text-pink-500"
    },
    aviso: {
        icon: Info,
        color: "text-amber-500"
    },
    like: {
        icon: ThumbsUp,
        color: "text-blue-500"
    }
};

type IconNotificacionProps = {
    tipo: Notification["tipo"];
}

export default function IconNotificacion({ tipo }: IconNotificacionProps) {
    const { icon: Icon, color } = tiposNotificacion[tipo];

    return (
        <Icon className={`h-4 w-4 ${color}`}/>
    )
}
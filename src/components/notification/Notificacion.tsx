import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import DeleteNotificacion from "./DeleteNotificacion";
import { formatDate } from "../../utils/date";
import { ArrowRight, Check, Info, MessageCircle, RotateCw, ThumbsUp } from "lucide-react";
import type { MouseEvent } from "react";
import type { Notification } from "../../types"

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

type NotificacionProps = {
    notificacion: Notification;
}

export default function Notificacion({ notificacion }: NotificacionProps) {
    const navigate = useNavigate();

    const { icon: Icon, color } = tiposNotificacion[notificacion.tipo];

    const handleClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.preventDefault();

        const url = `/post/reporte/${notificacion.post_id}?createdAt=${notificacion.post_created_at}`;
        navigate(url);
    };

    return (
        <Card 
            className={`border p-5 cursor-pointer hover:shadow-md hover:shadow-primary/20 transition-shadow ${notificacion.leido ? "opacity-60 hover:opacity-100" : "border-l-4"}`}
            onClick={handleClick}
        >
            <div className="flex gap-2">
                <Icon className={`h-4 w-4 ${color}`}/>

                <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{notificacion.titulo}</p>

                        { notificacion.leido ?
                            <div className="flex items-center gap-1">
                                <Check className="h-3 w-3 text-muted-foreground"/>
                                <p className="text-xs text-muted-foreground">Leido</p>
                            </div>
                            :
                            <div className="bg-primary h-2.5 w-2.5 rounded-full cursor-pointer"/>
                        }
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{notificacion.descripcion}</p>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{formatDate(notificacion.post_created_at)}</p>
                    
                        <div className="flex gap-3">
                            <DeleteNotificacion id={notificacion.receptor_id}/>

                            <Button
                                variant="link"
                                className="flex items-center gap-1"
                                style={{ padding: 0, height: "auto" }}
                            >
                                <p className="text-xs">Ver Reporte</p>
                                <ArrowRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>              
            </div>
        </Card>
    )
}
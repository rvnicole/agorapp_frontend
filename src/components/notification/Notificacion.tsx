import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import SwipeLeft from "../ui/SwipeLeft";
import IconNotificacion from "./IconNotificacion";
import StatusNotificacion from "./StatusNotificacion";
import { deleteNotification, updateNotification } from "../../api/notificationsAPI";
import { formatDate } from "../../utils/date";
import { ArrowRight, Loader2, Trash2 } from "lucide-react";
import type { ApiErrorType, Notification } from "../../types";
import type { MouseEvent } from "react";

type NotificacionProps = {
  notificacion: Notification;
};

export default function Notificacion({ notificacion }: NotificacionProps) {
    const { showMessages } = useMessageStore( state => state );
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const isTouchDevice = 'ontouchstart' in window;

    const { mutate } = useMutation({
        mutationFn: () => updateNotification({ receptor_id: notificacion.receptor_id }),
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    const { mutate: mutateDelete , isPending } = useMutation({
        mutationFn: () => deleteNotification({ receptor_id: notificacion.receptor_id }),
        onSuccess: (data) => {
            if( !data.success ) return;
            showMessages("success", "Notificación eliminada");

            queryClient.setQueryData(
                ["get-notifications"], 
                (oldData: {pages: Notification[][]}) => {
                    if (!oldData) return oldData;

                    const pages = oldData.pages;
                    const newNotifications = pages.map( page => page.filter(notification => notification.receptor_id !== notificacion.receptor_id));
                    
                    return {
                        ...oldData,
                        pages: newNotifications
                    };
                }
            );
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    const handleClick = (e: MouseEvent<HTMLDivElement|HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault();
        mutate();

        const url = `/post/reporte/${notificacion.post_id}?createdAt=${notificacion.post_created_at}`;
        navigate(url);
    };

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-destructive flex items-center justify-end p-5 md:rounded-2xl">
                <Trash2 className="h-5 w-5 text-destructive-foreground"/>
            </div>

            <SwipeLeft action={mutateDelete}>
                <Card className={`border p-5 cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-shadow ${!notificacion.leido && "border-l-4 border-l-primary"}`}>
                    <div className="flex gap-2">
                        <IconNotificacion tipo={notificacion.tipo} />

                        <div className="space-y-1 w-full">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{notificacion.titulo}</p>
                                <StatusNotificacion leido={notificacion.leido}/>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">{notificacion.descripcion}</p>

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">{formatDate(notificacion.notification_created_at)}</p>
                            
                                <div className="flex gap-3">
                                    { !isTouchDevice &&
                                        <Button
                                            size="sm"
                                            variant="link"
                                            style={{ padding:0, height:"auto" }}
                                            onClick={() => mutateDelete()}
                                        >            
                                            { isPending ? (
                                                <span className="flex gap-1 text-xs">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Eliminando...
                                                </span>
                                            ) : <span className="text-xs">Eliminar</span> }
                                        </Button>
                                    }                                    

                                    <Button
                                        variant="link"
                                        className="flex items-center gap-1"
                                        style={{ padding: 0, height: "auto" }}
                                        onClick={handleClick}
                                    >
                                        <p className="text-xs">Ver Reporte</p>
                                        <ArrowRight className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>              
                    </div>
                </Card>
            </SwipeLeft>
        </div>
        
    )
}
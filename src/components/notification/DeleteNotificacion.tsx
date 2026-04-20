import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { Button } from "../ui/Button";
import { deleteNotification } from "../../api/notificationsAPI";
import { Loader2 } from "lucide-react";
import type { ApiErrorType, Notification } from "../../types";
import type { MouseEvent } from "react";

type DeleteNotificacionProps = {
    id: Notification["receptor_id"];
}

export default function DeleteNotificacion({ id }: DeleteNotificacionProps) {
    const { showMessages } = useMessageStore( state => state );
    
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteNotification({ receptor_id: id }),
        onSuccess: (data) => {
            console.log("Delet-Notification", data);
            if( !data.success ) return;
            showMessages("success", "Notificación eliminada");

            queryClient.setQueryData(
                ["get-notifications"], 
                (oldData: Notification[]) => {
                    if (!oldData) return oldData;
                    const newNotifications = oldData.filter(notification => notification.receptor_id !== id);
                    return newNotifications;
                }
            );
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    const handleDelete = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.stopPropagation();
        console.log("Eliminando...")
        mutate();
    }

    return (
        <Button
            size="sm"
            variant="link"
            style={{ padding:0, height:"auto" }}
            onClick={handleDelete}
        >            
            { isPending ? (
                <span className="flex gap-1 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Eliminando...
                </span>
            ) : <span className="text-xs">Eliminar</span> }
        </Button>
    )
}
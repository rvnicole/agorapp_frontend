import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { useUserStore } from "../../../store/userStore";
import { Button } from "../../ui/Button";
import { Loader2, Trash2 } from "lucide-react";
import { deletePost } from "../../../api/PostAPI";
import type { ApiErrorType, PostRespuesta } from "../../../types";

type DeletePostProps = {
    id: PostRespuesta["id"];
    createdAt: PostRespuesta["created_at"]
    creador: PostRespuesta["alias"];
}

export default function DeletePost({ id, createdAt, creador }: DeletePostProps) {
    const { showMessages } = useMessageStore( state => state );
    const { user: { alias }} = useUserStore( state => state );

    if( alias !== creador ) return null;

    const { mutate, isPending } = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            showMessages("success", "Reporte creado");
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    return (
        <div>
            { isPending ?
                <div className="flex items-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                    <p className="font-semibold text-destructive">
                        Eliminando
                        <span className="animate-pulse">...</span>
                    </p>
                </div>
                :
                <Button
                    size="icon-lg"
                    variant="destructive"
                    className="flex justify-center items-center rounded-full"
                    onClick={() => mutate({ id, createdAt })}
                >
                    <Trash2 />
                </Button>
            }
        </div>
    )
}
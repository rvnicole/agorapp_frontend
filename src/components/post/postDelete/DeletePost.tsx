import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/userStore";
import { Button } from "../../ui/Button";
import { deletePost } from "../../../api/PostAPI";
import { Popover, PopoverContent, PopoverItem, PopoverTrigger } from "../../ui/Popover";
import { EllipsisVertical, Trash2 } from "lucide-react";
import type { ApiErrorType, PostRespuesta } from "../../../types";

type DeletePostProps = {
    id: PostRespuesta["id"];
    createdAt: PostRespuesta["created_at"]
    creador: PostRespuesta["alias"];
}

export default function DeletePost({ id, createdAt, creador }: DeletePostProps) {
    const { showMessages } = useMessageStore( state => state );
    const { user: { alias }} = useUserStore( state => state );
    const navigate = useNavigate();

    if( alias !== creador ) return null;

    const { mutate, isPending } = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            navigate("/");
            showMessages("success", "Reporte eliminado");
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <Button 
                        className="flex items-center justify-center rounded-full bg-transparent"
                        variant="secondary"
                        size="icon"
                        disabled={isPending}
                    >
                        <EllipsisVertical className="h-5 w-5 text-muted-foreground"/>
                    </Button>
                </PopoverTrigger>

                { !isPending &&
                    <PopoverContent className="w-fit">
                        <PopoverItem 
                            key={`delete-post-${id}`}
                            onClick={() => mutate({ id, createdAt })}
                        >
                            <Trash2 className="size-4"/>
                            Eliminar
                        </PopoverItem>
                    </PopoverContent>
                }
            </Popover>
        </div>
    )
}
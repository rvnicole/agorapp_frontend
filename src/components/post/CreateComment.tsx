import { useState, type ChangeEvent } from "react";
import { useUserStore } from "../../store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { createComment } from "../../api/PostAPI";
import { Loader2, Send } from "lucide-react";
import type { ApiErrorType, Comentario, Post } from "../../types";

type CreateCommentProps = {
    id: Post["id"],
    createdAt: Post["createdAt"],
    usuarioId: Post["usuarioId"]
    replyCommentId?: Comentario["replyCommentId"];
    onSuccess?: (comentario: Comentario) => void;
}

export default function CreateComment({ id, createdAt, usuarioId, replyCommentId, onSuccess }: CreateCommentProps) {
    const [comentario, setComentario] = useState("");
    const { showMessages } = useMessageStore( state => state );
    const { user: { alias } } = useUserStore( state => state )

    const { mutate, isPending } = useMutation({
        mutationFn: createComment,
        onSuccess: (data) => {
            if( onSuccess && data && data.success ) {
                onSuccess({
                    ...data.data,
                    usuario: alias
                });

                setComentario("");
            }
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => {
                showMessages("error", error);
            }); 
        }
    });

    const OnChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComentario(e.target.value);
    }

    return (
        <div className="flex flex-col gap-3 items-end">
            <Textarea 
                placeholder="Escribe un comentario..."
                onChange={OnChangeComment}
                value={comentario}
            />
            
            <Button
                className="flex justify-center items-center gap-2 w-fit"
                disabled={!Boolean(comentario) || isPending}
                onClick={() => mutate({ id, createdAt, usuarioId, comentario, replyCommentId })}
            >
                { isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cargando...
                    </>
                ) : (
                    <>
                        <Send className="h-5 w-5"/>
                        Comentar
                    </>                        
                )}
            </Button>
        </div>  
    )
}
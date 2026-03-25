import { useState, type ChangeEvent } from "react";
import { useUserStore } from "../../store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { createComment } from "../../api/CommentAPI";
import { Loader2, Send } from "lucide-react";
import type { ApiErrorType, Comentario, ComentarioRespuesta, Post } from "../../types";

type CreateCommentProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"],
    usuarioId: Post["usuarioId"]
    replyCommentId?: ComentarioRespuesta["replyCommentId"];
    onSuccess?: (comentario: Comentario) => void;
}

export default function CreateComment({ postId, createdAt, usuarioId, replyCommentId, onSuccess }: CreateCommentProps) {
    const [comentario, setComentario] = useState("");
    const { showMessages } = useMessageStore( state => state );
    const { user: { alias } } = useUserStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: createComment,
        onSuccess: (data) => {
            setComentario("");

            if( onSuccess && data && alias ) {
                console.log(data);

                onSuccess({
                    id: data.comentId,
                    comentario: data.comentario,
                    created_at: data.fecha,
                    alias: alias
                });
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

    if( replyCommentId ) {
        return (
            <div className="flex gap-1 items-start mt-5">
                <Textarea 
                    className="text-sm min-h-min"
                    placeholder="Escribe un comentario..."
                    onChange={OnChangeComment}
                    value={comentario}
                />

                <Button 
                    className="flex items-center bg-transparent"
                    variant="secondary"
                    onClick={() => mutate({ id: postId, createdAt, usuarioId, comentario, replyCommentId })}
                >
                    { isPending ?
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        : 
                        <Send className="h-5 w-5 text-primary"/> 
                    }
                </Button>
            </div>
        )
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
                onClick={() => mutate({ id: postId, createdAt, usuarioId, comentario })}
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
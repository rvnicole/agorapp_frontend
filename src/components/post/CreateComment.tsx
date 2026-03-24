import { useState, type ChangeEvent } from "react";
import { useUserStore } from "../../store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { createComment } from "../../api/PostAPI";
import { Loader2, Send, Undo2 } from "lucide-react";
import type { ApiErrorType, Comentario, Post } from "../../types";

type CreateCommentProps = {
    id: Post["id"],
    createdAt: Post["createdAt"],
    usuarioId: Post["usuarioId"]
    replyCommentId?: Comentario["replyCommentId"];
    reply?: boolean;
    onSuccess?: (comentario: Comentario) => void;
}

export default function CreateComment({ id, createdAt, usuarioId, replyCommentId, reply, onSuccess }: CreateCommentProps) {
    const [comentario, setComentario] = useState("");
    const { showMessages } = useMessageStore( state => state );
    const { user: { alias } } = useUserStore( state => state );

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

    if( reply ) {
        return (
            <div className="flex gap-3 items-start mt-5">
                <Textarea 
                    className="min-h-min"
                    placeholder="Escribe un comentario..."
                    onChange={OnChangeComment}
                    value={comentario}
                />

                <Button 
                    className="flex items-center gap-1 py-1"
                    variant="secondary"
                    onClick={() => {}}
                >
                    { isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cargando...
                        </>
                    ) : (
                        <>
                            <Undo2 className="w-3 h-3" />
                            <p className="text-xs">Responder</p>
                        </>                        
                    )}
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
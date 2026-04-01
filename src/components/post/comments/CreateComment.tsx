import { useState, type ChangeEvent } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from "../../../store/userStore";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { Button } from "../../ui/Button";
import { Textarea } from "../../ui/Textarea";
import { createComment } from "../../../api/CommentAPI";
import { Loader2, Send } from "lucide-react";
import type { ApiErrorType, Comentario, ComentarioRespuesta, Post, PostRespuesta } from "../../../types";

type CreateCommentProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"],
    usuarioId: Post["usuarioId"]
    replyCommentId?: ComentarioRespuesta["replyCommentId"];
}

export default function CreateComment({ postId, createdAt, usuarioId, replyCommentId }: CreateCommentProps) {
    const [comentario, setComentario] = useState("");

    const { showMessages } = useMessageStore( state => state );
    const { user: { alias, url_img } } = useUserStore( state => state );

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createComment,
        onSuccess: (data) => {
            setComentario("");

            const comment: Comentario = {
                id: data.comentId,
                comentario: data.comentario,
                created_at: data.fecha,
                alias: alias!,
                url_img
            }

            queryClient.setQueryData(
                ["get-post", postId, createdAt], 
                (oldData: PostRespuesta[]) => {
                    if (!oldData) return oldData;

                    const newData = {...oldData[0]};
                    newData.total_comentarios = newData.total_comentarios + 1
                    return [newData];
                }
            );

            if( replyCommentId ) {
                queryClient.setQueryData<Comentario[]>(
                    ["answers", replyCommentId], 
                    (old = []) => [ comment, ...old ]
                );
            }
            else {
                queryClient.setQueryData<{ pages: Comentario[][] }>(
                    ['comments', postId], 
                    (oldData) => {
                        if (!oldData) return oldData;

                        const alreadyExists = oldData.pages.some(page =>page.some(c => c.id === comment.id));                          
                        if (alreadyExists) return oldData;
                    
                        const newPages = oldData.pages.map((page, index) => {
                            if (index === 0) {
                                const filtered = page.filter(c => c.id !== comment.id);
                                return [comment, ...filtered];
                            }
                            return page.filter(c => c.id !== comment.id);
                        });
                    
                        return {...oldData, pages: newPages};
                    }
                );
            }
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    const OnChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComentario(e.target.value);
    }

    if( replyCommentId ) {
        return (
            <div className="flex gap-2 items-start">
                <Textarea 
                    className="text-sm min-h-[38px] max-h-[120px]"
                    placeholder="Escribe un comentario..."
                    onChange={OnChangeComment}
                    value={comentario}
                />

                <Button 
                    className="flex items-center"
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
                className="max-h-60"
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
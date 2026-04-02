import { useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../../../../store/messageStore";
import { Textarea } from "../../../ui/Textarea";
import { Button } from "../../../ui/Button";
import { editComment } from "../../../../api/CommentAPI";
import { Loader2, Send, X } from "lucide-react";
import type { ApiErrorType, Comentario, Post } from "../../../../types";

type EditCommentProps = {
    postId: Post["id"];
    createdAt: Post["createdAt"];
    comment: Comentario;
    replyCommentId?: Comentario["id"];
    onClose: () => void;
}

export default function EditComment({ postId, createdAt, comment, replyCommentId, onClose }: EditCommentProps) {
    const [comentario, setComentario] = useState(comment.comentario);
    const { showMessages } = useMessageStore( state => state );

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => editComment({
            id: postId,
            createdAt,
            comentId: comment.id,
            comentario
        }),
        onSuccess: (data) => {
            if(data.success) showMessages("success", "Comentario actualizado");

            if( replyCommentId ) {
                queryClient.setQueryData<Comentario[]>(
                    ["answers", replyCommentId], 
                    (old = []) => {
                        const newComments = old.map(c => c.id === comment.id ? { ...c, comentario} : c);
                        return [...newComments];
                    }
                );
            }
            else {
                queryClient.setQueryData<{ pages: Comentario[][] }>(
                    ['comments', postId], 
                    (oldData) => {
                        if (!oldData) return oldData;
                    
                        const newPages = oldData.pages.map(page => {
                            return page.map(c => c.id === comment.id ? { ...c, comentario} : c);
                        });
                    
                        return {...oldData, pages: newPages};
                    }
                );
            }

            onClose();
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    const OnChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComentario(e.target.value);
    }

    return (
        <div className="flex gap-2">
            <Textarea 
                placeholder="Escribe un comentario..."
                className="max-h-60"
                onChange={OnChangeComment}
                value={comentario}
            />

            <div className="flex flex-col items-center gap-2">
                <Button 
                    className="flex justify-center items-center gap-2"
                    onClick={() => mutate()}
                >
                    { isPending ?
                        <Loader2 className="h-4 w-4 animate-spin" />
                        : 
                        <Send className="h-4 w-4"/> 
                    }
                </Button>

                <Button 
                    className="flex justify-center items-center rounded-full" 
                    variant="secondary"
                    size="icon"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
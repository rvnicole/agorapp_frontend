import { useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { Textarea } from "../../ui/Textarea";
import { Button } from "../../ui/Button";
import { editComment } from "../../../api/CommentAPI";
import { Loader2, Send, X } from "lucide-react";
import type { ApiErrorType, Comentario } from "../../../types";

type EditCommentProps = {
    comment: Comentario;
    onClose: () => void;
}

export default function EditComment({ comment, onClose }: EditCommentProps) {
    const [comentario, setComentario] = useState(comment.comentario);
    const { showMessages } = useMessageStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: editComment,
        onSuccess: (data) => {
            console.log(data);
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